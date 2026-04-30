"""
Entity Distribution Service
---------------------------
Aggregates entity types across processed data

Supports structure:
{
  "PERSON": ["Modi"],
  "ORG": ["ICRA"],
  "GPE": ["India"]
}
"""

from sqlalchemy.orm import Session
from app.models.processed_data import ProcessedData


def get_entity_distribution(db: Session):
    results = db.query(ProcessedData.entities).all()

    counter: dict[str, int] = {}

    for row in results:
        entities = row[0]

        # ================================
        # SAFETY CHECK
        # ================================
        if not entities or not isinstance(entities, dict):
            continue

        # ================================
        # CORRECT STRUCTURE HANDLING
        # ================================
        for label, values in entities.items():
            if not isinstance(values, list):
                continue

            # count number of entities under this label
            counter[label] = counter.get(label, 0) + len(values)

    # ================================
    # SORT (important for UI)
    # ================================
    sorted_entities = sorted(
        counter.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # ================================
    # FORMAT FOR FRONTEND
    # ================================
    return [
        {"name": label, "value": count}
        for label, count in sorted_entities
    ]