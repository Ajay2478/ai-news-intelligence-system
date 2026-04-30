from sqlalchemy import Column, Integer, String, Text, Float, TIMESTAMP, ForeignKey
from datetime import datetime

from app.db.base import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    url = Column(Text, unique=True)
    category = Column(String(50))
    importance_score = Column(Float, default=0)

    source_id = Column(Integer, ForeignKey("sources.id"))

    published_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)