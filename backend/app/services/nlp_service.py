import re
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer

import spacy


# Load spaCy model once (global, avoid reloading per request)
# Use small model for performance; upgrade later if needed
nlp = spacy.load("en_core_web_sm")


# -------------------------------
# PREPROCESS TEXT
# -------------------------------
def normalize_text(text: str) -> str:
    """
    Normalize text before NLP processing
    """
    if not text:
        return ""

    # Lowercase
    text = text.lower()

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# -------------------------------
# KEYWORD EXTRACTION (TF-IDF)
# -------------------------------
def extract_keywords(text: str, top_k: int = 5) -> List[str]:
    """
    Extract top keywords using TF-IDF
    """
    if not text or len(text) < 20:
        return []

    try:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=top_k
        )

        vectors = vectorizer.fit_transform([text])
        keywords = vectorizer.get_feature_names_out().tolist()

        return keywords

    except Exception:
        return []


# -------------------------------
# SIMPLE EXTRACTIVE SUMMARY
# -------------------------------
def generate_summary(text: str, max_sentences: int = 2) -> str:
    """
    Basic extractive summary using sentence splitting
    (fast + deterministic)
    """
    if not text:
        return ""

    sentences = re.split(r"(?<=[.!?])\s+", text)

    # Filter very short sentences
    sentences = [s for s in sentences if len(s.split()) > 5]

    if not sentences:
        return text[:150]

    return " ".join(sentences[:max_sentences])


# -------------------------------
# ENTITY EXTRACTION (spaCy)
# -------------------------------
def extract_entities(text: str) -> List[str]:
    """
    Extract named entities (People, Org, Location)
    """
    if not text:
        return []

    try:
        doc = nlp(text)

        entities = set()

        for ent in doc.ents:
            if ent.label_ in {"PERSON", "ORG", "GPE"}:
                entities.add(ent.text.strip())

        return list(entities)

    except Exception:
        return []