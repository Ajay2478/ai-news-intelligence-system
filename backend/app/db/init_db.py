from app.db.base import Base
from app.db.session import engine
from app.models import *

# MUST import ALL models here
from app.models.article import Article
from app.models.source import Source
from app.models.processed_data import ProcessedData


def init_db():
    Base.metadata.create_all(bind=engine)