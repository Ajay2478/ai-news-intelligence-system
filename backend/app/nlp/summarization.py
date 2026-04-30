"""
Summarization Service
---------------------
- Extractive summarization using TextRank
- Robust fallback mechanism
- Clean, stable output
"""

import re
from typing import List

from sumy.summarizers.text_rank import TextRankSummarizer
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer


# ================================
# CLEAN TEXT
# ================================
def clean_text(text: str) -> str:
    if not text:
        return ""

    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ================================
# FALLBACK (SAFE EXTRACTION)
# ================================
def fallback_summary(text: str, max_sentences: int) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", text)

    # filter weak sentences
    sentences = [s.strip() for s in sentences if len(s.split()) > 5]

    if not sentences:
        return text[:200]

    return " ".join(sentences[:max_sentences])


# ================================
# MAIN FUNCTION
# ================================
def generate_summary(text: str, max_sentences: int = 3) -> str:
    """
    Generate summary using TextRank with fallback
    """

    if not text or len(text) < 50:
        return text or ""

    text = clean_text(text)

    try:
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = TextRankSummarizer()

        summary_sentences = summarizer(parser.document, max_sentences)

        result: List[str] = [str(sentence) for sentence in summary_sentences]

        # if TextRank fails silently
        if not result:
            return fallback_summary(text, max_sentences)

        return " ".join(result)

    except Exception:
        # fallback if library crashes
        return fallback_summary(text, max_sentences)