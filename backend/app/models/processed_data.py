"""
Processed Data Model
--------------------
Stores NLP processed results for each article
"""

from sqlalchemy import Column, Integer, ForeignKey, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

from app.db.base import Base


class ProcessedData(Base):
    __tablename__ = "processed_data"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key → Article
    article_id = Column(
        Integer,
        ForeignKey("articles.id", ondelete="CASCADE"),
        nullable=False,
    )

    # NLP Outputs
    summary = Column(Text, nullable=False)
    keywords = Column(JSONB, nullable=False)
    entities = Column(JSONB, nullable=False)

    #  NEW: Importance Score (AI Ranking)
    importance = Column(Integer, default=0)

    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)