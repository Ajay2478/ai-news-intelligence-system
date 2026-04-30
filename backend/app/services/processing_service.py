"""
Processing Service (Production-Ready)
------------------------------------
Handles:
- Summarization
- Keyword extraction
- Entity extraction
- Importance scoring
- Safe DB persistence
"""

import logging
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.article import Article
from app.models.processed_data import ProcessedData

from app.nlp.summarization import generate_summary
from app.nlp.keywords import extract_keywords
from app.nlp.entities import extract_entities
from app.nlp.scoring import calculate_importance


# Structured logger
logger = logging.getLogger(__name__)


# -------------------------------
# MAIN PROCESSING FUNCTION
# -------------------------------
def process_articles(db: Session, batch_size: int = 50) -> int:
    """
    Process unprocessed articles in batches

    Args:
        db: Database session
        batch_size: Number of articles per batch

    Returns:
        int: number of processed articles
    """

    processed_count = 0

    # -------------------------------
    # Efficient Query (LEFT JOIN instead of IN)
    # -------------------------------
    articles: List[Article] = (
        db.query(Article)
        .outerjoin(
            ProcessedData,
            Article.id == ProcessedData.article_id
        )
        .filter(ProcessedData.id.is_(None))
        .limit(batch_size)
        .all()
    )

    logger.info(f"Found {len(articles)} unprocessed articles")

    # -------------------------------
    # Process each article
    # -------------------------------
    for article in articles:
        try:
            # -----------------------------
            # Safe text preparation
            # -----------------------------
            text = (article.content or article.title or "").strip()

            # Skip useless data early
            if not text or len(text) < 30:
                continue

            # -----------------------------
            # NLP Processing
            # -----------------------------
            summary = generate_summary(text, max_sentences=3)

            keywords = extract_keywords(text) or []

            entities = extract_entities(text) or {}

            # Flatten entities for scoring
            flat_entities = []
            for value in entities.values():
                if isinstance(value, list):
                    flat_entities.extend(value)

            # -----------------------------
            # Importance Scoring
            # -----------------------------
            importance = calculate_importance(
                keywords=keywords,
                entities=flat_entities,
                text=text
            )

            # -----------------------------
            # Save to DB
            # -----------------------------
            processed = ProcessedData(
                article_id=article.id,
                summary=summary,
                keywords=keywords,
                entities=entities,      # structured JSON
                importance=importance   # float score
            )

            db.add(processed)
            processed_count += 1

        except Exception as e:
            logger.error(
                f"Processing failed | article_id={article.id} | error={str(e)}"
            )

    # -------------------------------
    # Commit safely
    # -------------------------------
    try:
        db.commit()
        logger.info(f"Successfully processed {processed_count} articles")

    except SQLAlchemyError as e:
        logger.error(f"Commit failed: {str(e)}")
        db.rollback()

    return processed_count