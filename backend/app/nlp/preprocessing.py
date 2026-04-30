"""
Text Preprocessing Module
-------------------------
Production-grade preprocessing for news data

Features:
- HTML removal
- URL cleanup
- Unicode normalization
- Noise filtering
- Safe sentence tokenization
"""

import re
import unicodedata
from typing import List

from nltk.tokenize import sent_tokenize


# ================================
# CLEAN TEXT
# ================================
def clean_text(text: str) -> str:
    """
    Clean raw article text

    Steps:
    - Normalize unicode
    - Remove HTML
    - Remove URLs
    - Remove extra whitespace
    - Strip unwanted characters
    """

    if not text:
        return ""

    # Normalize unicode (important for real news data)
    text = unicodedata.normalize("NFKC", text)

    # Remove HTML tags
    text = re.sub(r"<.*?>", " ", text)

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", " ", text)

    # Remove non-text noise (keep basic punctuation)
    text = re.sub(r"[^a-zA-Z0-9.,!?;:%()\-\s]", " ", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ================================
# SENTENCE TOKENIZATION
# ================================
def tokenize(text: str) -> List[str]:
    """
    Safely tokenize text into sentences

    Falls back to simple split if NLTK fails
    """

    if not text:
        return []

    try:
        sentences = sent_tokenize(text)
    except Exception:
        # fallback (important for production robustness)
        sentences = re.split(r"[.!?]+", text)

    # Clean empty sentences
    sentences = [s.strip() for s in sentences if s.strip()]

    return sentences


# ================================
# OPTIONAL: FULL PIPELINE
# ================================
def preprocess(text: str) -> List[str]:
    """
    Full preprocessing pipeline:
    clean → tokenize
    """

    cleaned = clean_text(text)
    return tokenize(cleaned)