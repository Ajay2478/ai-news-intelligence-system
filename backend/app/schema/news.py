from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class NewsItemResponse(BaseModel):
    id: int
    title: str
    summary: str
    keywords: List[str]
    entities: Dict[str, List[str]]
    importance: float
    published_at: Optional[datetime]

    class Config:
        from_attributes = True


class NewsListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[NewsItemResponse]