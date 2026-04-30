from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.article import Article
from app.models.processed_data import ProcessedData


def get_news_headlines(
    db: Session,
    page: int | None = None,
    page_size: int | None = None,
):
    """
    Fetch news headlines with processed data

    Modes:
    - FULL MODE (default): returns all records
    - PAGINATED MODE: if page + page_size provided

    This keeps:
    - demo correct (no fake limits)
    - production scalable
    """

    query = (
        db.query(Article, ProcessedData)
        .outerjoin(
            ProcessedData,
            Article.id == ProcessedData.article_id
        )
        .order_by(Article.published_at.desc())
    )

    total = db.query(func.count(Article.id)).scalar()

    # ================================
    # PAGINATION (OPTIONAL)
    # ================================
    if page is not None and page_size is not None:
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

    results = query.all()

    items = []

    for article, processed in results:
        items.append({
            "id": article.id,
            "title": article.title or "",
            "summary": processed.summary if processed else "",
            "keywords": processed.keywords if processed else [],
            "entities": processed.entities if processed else {},
            "importance": processed.importance if processed else 0,

            # timestamps
            "published_at": (
                article.published_at.isoformat()
                if article.published_at else None
            ),
            "created_at": (
                article.created_at.isoformat()
                if article.created_at else None
            ),
        })

    return {
        "total": total,
        "count": len(items),  # important for frontend
        "items": items
    }