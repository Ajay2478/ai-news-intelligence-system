"""
Entity Extraction Service
-------------------------
- Uses spaCy
- Deduplicates entities
- Normalizes values
- Filters noise
- Returns clean structured output
"""

import spacy

# Load once (important for performance)
nlp = spacy.load("en_core_web_sm")


# ================================
# NORMALIZATION
# ================================
def normalize(text: str) -> str:
    return text.strip()


# ================================
# MAIN FUNCTION
# ================================
def extract_entities(text: str):
    doc = nlp(text)

    # Supported entity types
    entities = {
        "PERSON": set(),
        "ORG": set(),
        "GPE": set(),
        "LOC": set(),
    }

    for ent in doc.ents:
        label = ent.label_

        if label not in entities:
            continue

        value = normalize(ent.text)

        # ================================
        # FILTER BAD VALUES
        # ================================
        if (
            not value
            or len(value) < 3
            or value.isnumeric()
        ):
            continue

        entities[label].add(value)

    # ================================
    # CONVERT TO LIST + SORT
    # ================================
    clean_entities = {}

    for label, values in entities.items():
        if values:
            clean_entities[label] = sorted(values)

    return clean_entities