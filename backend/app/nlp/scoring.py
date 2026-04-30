"""
Importance Scoring System
-------------------------
Assigns importance score (0–100) to each article

Features:
- Weighted multi-signal scoring
- Entity-aware scoring
- Diminishing returns
- Stable normalization
"""

from math import log


# ================================
# CONFIG
# ================================
IMPORTANT_TERMS = {
    "economy", "war", "government",
    "market", "ai", "energy", "policy"
}


# ================================
# HELPERS
# ================================
def flatten_entities(entities: dict) -> int:
    """
    Count total entities safely
    """
    if not isinstance(entities, dict):
        return 0

    count = 0
    for values in entities.values():
        if isinstance(values, list):
            count += len(values)

    return count


def diminishing(value: int, scale: float = 10) -> float:
    """
    Apply diminishing returns using log
    """
    return log(1 + value) * scale


# ================================
# MAIN FUNCTION
# ================================
def calculate_importance(
    keywords: list,
    entities: dict,
    text: str
) -> int:
    """
    Calculate importance score (0–100)
    """

    score = 0.0

    # ================================
    # 1. KEYWORD SIGNAL
    # ================================
    keyword_count = len(keywords or [])
    keyword_score = diminishing(keyword_count, scale=12)
    score += min(keyword_score, 30)

    # ================================
    # 2. ENTITY SIGNAL
    # ================================
    entity_count = flatten_entities(entities)
    entity_score = diminishing(entity_count, scale=10)
    score += min(entity_score, 30)

    # ================================
    # 3. CONTENT DEPTH SIGNAL
    # ================================
    length = len((text or "").split())

    if length > 300:
        score += 20
    elif length > 150:
        score += 15
    elif length > 80:
        score += 10

    # ================================
    # 4. STRONG SIGNAL BOOST
    # ================================
    bonus = 0

    for k in keywords or []:
        if isinstance(k, str) and k.lower() in IMPORTANT_TERMS:
            bonus += 5

    score += min(bonus, 20)

    # ================================
    # 5. NORMALIZATION
    # ================================
    final_score = int(min(score, 100))

    return final_score