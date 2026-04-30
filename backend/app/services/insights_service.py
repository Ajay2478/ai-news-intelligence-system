"""
Insights Service
----------------
- Generates aggregated insights (REAL DATA)
- Importance-weighted
- Cached for performance
"""

from sqlalchemy.orm import Session
from collections import Counter
from app.models.processed_data import ProcessedData
from app.core.cache import get_cache, set_cache


# ================================
# NORMALIZATION
# ================================
def normalize(text: str) -> str:
    return text.lower().strip()


# ================================
# IMPORTANCE NORMALIZATION
# ================================
def normalize_importance(value) -> float:
    if value is None:
        return 1

    # support 0–1 and 0–100
    if isinstance(value, float) and value <= 1:
        return value * 100

    return float(value)


# ================================
# MAIN INSIGHTS FUNCTION
# ================================
def generate_insights(db: Session) -> str:
    cache_key = "ai_insights"

    cached = get_cache(cache_key)
    if cached:
        return cached

    # ================================
    # Fetch top articles (importance-based)
    # ================================
    rows = db.query(
        ProcessedData.summary,
        ProcessedData.keywords,
        ProcessedData.entities,
        ProcessedData.importance
    ).order_by(ProcessedData.importance.desc()).limit(20).all()

    if not rows:
        return "No insights available."

    keyword_counter = Counter()
    entity_counter = Counter()

    # ================================
    # Aggregate signals (weighted)
    # ================================
    for summary, keywords, entities, importance in rows:

        importance_score = normalize_importance(importance)
        weight = max(1, int(importance_score // 10))

        # keywords
        if isinstance(keywords, list):
            for k in keywords:
                if isinstance(k, str):
                    keyword_counter[normalize(k)] += weight

        # entities
        if isinstance(entities, dict):
            for values in entities.values():
                if isinstance(values, list):
                    for e in values:
                        if isinstance(e, str):
                            entity_counter[normalize(e)] += weight

    # ================================
    # Build insight (data-driven)
    # ================================
    insight_parts = []

    top_keywords = [k for k, _ in keyword_counter.most_common(5)]
    top_entities = [e for e, _ in entity_counter.most_common(5)]

    if top_keywords:
        insight_parts.append(
            f"Trending topics include {', '.join(top_keywords[:3])}."
        )

    if top_entities:
        insight_parts.append(
            f"Key entities involved are {', '.join(top_entities[:3])}."
        )

    # ================================
    # Optional signal extraction (less fake)
    # ================================
    if "ai" in top_keywords or "technology" in top_keywords:
        insight_parts.append("Technology-related developments are gaining momentum.")

    if "energy" in top_keywords or "power" in top_keywords:
        insight_parts.append("Energy sector activity is increasing.")

    if "economy" in top_keywords or "market" in top_keywords:
        insight_parts.append("Economic trends are actively evolving.")

    result = " ".join(insight_parts) or "No strong insights available."

    # ================================
    # Cache result
    # ================================
    set_cache(cache_key, result, ttl=60)

    return result