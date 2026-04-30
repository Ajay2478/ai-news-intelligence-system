from app.db.session import SessionLocal
from app.services.processing_service import process_articles


def run():
    db = SessionLocal()

    try:
        count = process_articles(db)
        print(f" Processed {count} articles")

    finally:
        db.close()


if __name__ == "__main__":
    run()