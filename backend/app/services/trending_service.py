"""
Trending Topics Service
-----------------------
Aggregates keywords to find top trending topics
- Weighted by importance
- Cached for performance
- Production-safe normalization
"""

from sqlalchemy.orm import Session
from collections import Counter
import re

from app.models.processed_data import ProcessedData
from app.core.cache import get_cache, set_cache


# ================================
# STOPWORDS (domain-specific)
# ================================
STOPWORDS = {
    "april", "may", "june", "july",
    "company", "said", "also", "year",
    "today", "new", "time", "announced"
}


# ================================
# NORMALIZATION
# ================================
def normalize(word: str) -> str:
    word = word.lower()
    word = re.sub(r"[^\w\s]", "", word)

    # simple plural normalization
    if word.endswith("s") and len(word) > 4:
        word = word[:-1]

    return word.strip()


# ================================
# IMPORTANCE NORMALIZATION
# ================================
def normalize_importance(value) -> float:
    """
    Supports:
    - 0–1 scale
    - 0–100 scale
    """
    if value is None:
        return 1

    if isinstance(value, float) and value <= 1:
        return value * 100  # convert to 0–100

    return float(value)


# ================================
# MAIN SERVICE
# ================================
def get_trending_topics(db: Session, limit: int = 5):

    cache_key = f"trending_topics_{limit}"

    cached = get_cache(cache_key)
    if cached:
        return cached

    rows = db.query(
        ProcessedData.keywords,
        ProcessedData.importance
    ).all()

    counter = Counter()

    for keywords, importance in rows:
        if not keywords or not isinstance(keywords, list):
            continue

        importance_score = normalize_importance(importance)

        for k in keywords:
            if not isinstance(k, str):
                continue

            k = normalize(k)

            if k in STOPWORDS or len(k) < 3:
                continue

            # weight calculation (scaled)
            weight = max(1, int(importance_score // 10))
            counter[k] += weight

    # ================================
    # FINAL RESULT
    # ================================
    result = counter.most_common(limit)

    # cache result (60 sec)
    set_cache(cache_key, result, ttl=60)

    return result