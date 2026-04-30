"""
News API Routes
---------------
Handles:
- Headlines (REAL DATA - no fake, no limit)
- Trending topics
- Entity distribution
- Insights
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api.deps import get_db

# Models
from app.models.article import Article
from app.models.processed_data import ProcessedData

# Services
from app.services.trending_service import get_trending_topics
from app.services.insights_service import generate_insights
from app.services.entity_service import get_entity_distribution

# Router
router = APIRouter()


# ================================
# HEADLINES (CRITICAL FIX)
# ================================
@router.get("/headlines")
def get_headlines(db: Session = Depends(get_db)):
    """
    Returns ALL articles with processed data
    - No LIMIT (real data only)
    - Joins articles + processed_data
    """

    results = (
        db.query(Article, ProcessedData)
        .outerjoin(
            ProcessedData,
            Article.id == ProcessedData.article_id
        )
        .order_by(desc(Article.published_at))
        .all()
    )

    response = []

    for article, processed in results:
        response.append({
            "id": article.id,
            "title": article.title or "",
            "summary": processed.summary if processed else "",
            "keywords": processed.keywords if processed else [],
            "entities": processed.entities if processed else {},
            "importance": article.importance_score or 0,

            # timestamps
            "created_at": article.created_at.isoformat() if article.created_at else None,
            "published_at": article.published_at.isoformat() if article.published_at else None,
        })

    return response


# ================================
# INSIGHTS
# ================================
@router.get("/insights")
def insights(db: Session = Depends(get_db)):
    return {
        "insight": generate_insights(db)
    }


# ================================
# TRENDING
# ================================
@router.get("/trending")
def trending(db: Session = Depends(get_db)):
    """
    Get trending topics based on keyword frequency
    """

    data = get_trending_topics(db)

    return [
        {"topic": k, "count": v}
        for k, v in data
    ]


# ================================
# ENTITY DISTRIBUTION
# ================================
@router.get("/entities")
def entity_distribution(db: Session = Depends(get_db)):
    return get_entity_distribution(db)