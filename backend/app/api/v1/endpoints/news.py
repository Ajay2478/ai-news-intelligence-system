from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_db
from app.services.news_service import get_news_headlines
from app.services.trending_service import get_trending_topics
from app.services.insights_service import generate_insights
from app.services.entity_service import get_entity_distribution

router = APIRouter()


# =========================
# HEADLINES
# =========================
@router.get("/headlines")
def get_headlines(
    page: int = Query(1, ge=1),
    page_size: Optional[int] = Query(None, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return get_news_headlines(db, page, page_size)


# =========================
# TRENDING
# =========================
@router.get("/trending")
def trending(db: Session = Depends(get_db)):
    data = get_trending_topics(db)

    return [
        {"topic": k, "count": v}
        for k, v in data
    ]


# =========================
# INSIGHTS
# =========================
@router.get("/insights")
def insights(db: Session = Depends(get_db)):
    return {
        "insight": generate_insights(db)
    }


# =========================
# ENTITY DISTRIBUTION
# =========================
@router.get("/entities")
def entity_distribution(db: Session = Depends(get_db)):
    return get_entity_distribution(db)

@router.get("/{news_id}")
def get_news_detail(news_id: int, db: Session = Depends(get_db)):
    """
    Get single news article by ID
    """

    from app.models.article import Article
    from app.models.processed_data import ProcessedData

    result = (
        db.query(Article, ProcessedData)
        .join(ProcessedData, Article.id == ProcessedData.article_id)
        .filter(Article.id == news_id)
        .first()
    )

    if not result:
        return {"error": "News not found"}

    article, processed = result

    return {
        "id": article.id,
        "title": article.title,
        "summary": processed.summary,
        "keywords": processed.keywords,
        "entities": processed.entities,
        "importance": processed.importance,
        "published_at": article.published_at,
        "created_at": article.created_at,
    }