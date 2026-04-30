from sqlalchemy import Column, Integer, String, Float

from app.db.base import Base


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    reliability_score = Column(Float, default=0)