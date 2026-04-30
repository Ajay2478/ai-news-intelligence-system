import requests
import re
import logging
from datetime import datetime
from typing import List, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.article import Article
from app.models.source import Source
from app.core.config import NEWS_API_KEY


# Configure logger (production-style)
logger = logging.getLogger(__name__)


BASE_URL = "https://newsapi.org/v2/everything"


# -------------------------------
# FETCH NEWS
# -------------------------------
def fetch_news(query: str = "india", page_size: int = 20) -> List[Dict[str, Any]]:
    """
    Fetch news articles from NewsAPI with basic fault tolerance
    """

    params = {
        "q": query,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": page_size,
        "apiKey": NEWS_API_KEY,
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)

        if response.status_code != 200:
            logger.error(f"NewsAPI error: {response.status_code} | {response.text}")
            return []

        data = response.json()
        articles = data.get("articles", [])

        logger.info(f"Fetched {len(articles)} articles")

        return articles

    except requests.exceptions.Timeout:
        logger.error("NewsAPI request timed out")
        return []

    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        return []


# -------------------------------
# CLEAN CONTENT
# -------------------------------
def clean_news_content(text: str) -> str:
    """
    Clean raw news content by removing noise
    """

    if not text:
        return ""

    # Remove "[+1234 chars]"
    text = re.sub(r"\[\+\d+\schars\]", "", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove unwanted characters but preserve punctuation
    text = re.sub(r"[^\w\s.,!?-]", "", text)

    return text.strip()


# -------------------------------
# SOURCE HANDLING
# -------------------------------
def get_or_create_source(db: Session, source_name: str) -> Source:
    """
    Ensure source exists (idempotent)
    """

    if not source_name:
        source_name = "Unknown"

    source = db.query(Source).filter(Source.name == source_name).first()

    if source:
        return source

    source = Source(name=source_name, reliability_score=0.5)

    db.add(source)
    db.commit()
    db.refresh(source)

    return source


# -------------------------------
# SAVE ARTICLES
# -------------------------------
def save_articles(db: Session, articles: List[Dict[str, Any]]) -> int:
    """
    Save fetched articles into DB safely and idempotently
    """

    inserted = 0

    for item in articles:

        try:
            url = item.get("url")
            title = item.get("title")

            # Basic validation
            if not url or not title:
                continue

            # Deduplication (critical)
            existing = db.query(Article).filter(Article.url == url).first()
            if existing:
                continue

            # Extract source safely
            source_data = item.get("source", {})
            source_name = source_data.get("name", "Unknown")
            source = get_or_create_source(db, source_name)

            # Content fallback strategy
            raw_content = (
                item.get("content")
                or item.get("description")
                or ""
            )

            cleaned_content = clean_news_content(raw_content)

            # Skip useless articles
            if len(cleaned_content) < 20:
                continue

            # Parse datetime safely
            published_at = None
            if item.get("publishedAt"):
                try:
                    published_at = datetime.strptime(
                        item["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
                    )
                except ValueError:
                    logger.warning("Invalid date format")

            article = Article(
                title=title.strip(),
                content=cleaned_content,
                url=url,
                category="general",
                source_id=source.id,
                published_at=published_at,
            )

            db.add(article)
            inserted += 1

        except SQLAlchemyError as db_err:
            logger.error(f"DB error: {str(db_err)}")
            db.rollback()

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")

    try:
        db.commit()
    except Exception as e:
        logger.error(f"Final commit failed: {str(e)}")
        db.rollback()

    logger.info(f"Inserted {inserted} new articles")

    return inserted