"""
Keyword Extraction Service
--------------------------
Production-grade keyword extraction using TF-IDF

Features:
- Supports unigrams + bigrams
- Domain-aware stopwords
- Stable normalization
- Deduplication
- Safe fallback handling
"""

from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from typing import cast
from scipy.sparse import spmatrix

# ================================
# CUSTOM STOPWORDS (DOMAIN CLEANING)
# ================================
CUSTOM_STOPWORDS = {
    "said", "also", "year", "new", "time",
    "company", "according", "reported",
    "today", "latest", "update"
}


# ================================
# NORMALIZATION
# ================================
def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ================================
# MAIN FUNCTION
# ================================
def extract_keywords(text: str, top_k: int = 8) -> List[str]:
    """
    Extract meaningful keywords using TF-IDF

    Args:
        text: article text
        top_k: number of keywords

    Returns:
        List[str]: keywords
    """

    if not text or len(text) < 20:
        return []

    clean_text = normalize(text)

    # ================================
    # TF-IDF CONFIG (PRODUCTION SAFE)
    # ================================
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),          # unigram + bigram
        max_features=50,             # limit noise
        token_pattern=r"\b[a-zA-Z]{3,}\b"  # only real words
    )

    try:
        X = vectorizer.fit_transform([clean_text])
        X = cast(spmatrix, X)  # safe type hint for Pylance
    except ValueError:
         return []

    scores = X.todense().A1
    terms = vectorizer.get_feature_names_out()

    # ================================
    # SCORING
    # ================================
    scored_terms = sorted(
        zip(terms, scores),
        key=lambda x: x[1],
        reverse=True
    )

    keywords = []
    seen = set()

    # ================================
    # FILTERING + DEDUP
    # ================================
    for term, score in scored_terms:
        if not term or score <= 0:
            continue

        # remove stopwords manually
        if term in CUSTOM_STOPWORDS:
            continue

        # avoid duplicates (important for bigrams)
        if term in seen:
            continue

        seen.add(term)
        keywords.append(term)

        if len(keywords) >= top_k:
            break

    return keywords