from app.db.session import SessionLocal
from app.services.news_ingestion_service import fetch_news, save_articles


def run():
    db = SessionLocal()

    try:
        articles = fetch_news()
        count = save_articles(db, articles)

        print(f" Inserted {count} new articles")

    finally:
        db.close()


if __name__ == "__main__":
    run()