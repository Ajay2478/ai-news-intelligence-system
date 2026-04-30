# 🧠 AI News Intelligence Backend

Production-grade backend for an AI-powered News Intelligence System.

---

## 🚀 Overview

This backend processes raw news articles and enriches them using NLP:

* Keyword extraction (TF-IDF)
* Entity recognition (spaCy)
* Summarization
* Importance scoring (0–100)
* Analytics (trending, insights, entity distribution)

---

## 🧱 Tech Stack

* **FastAPI** — API framework
* **PostgreSQL** — Database
* **SQLAlchemy** — ORM
* **spaCy** — Entity extraction
* **scikit-learn** — TF-IDF keywords
* **NLTK** — preprocessing

---

## 📂 Project Structure

```
app/
├── api/              # API routes
├── core/             # config, cache
├── db/               # DB connection
├── models/           # ORM models
├── nlp/              # NLP logic
├── services/         # business logic
├── schema/           # response schemas
└── main.py           # app entrypoint
```

---

## ⚙️ Setup

### 1. Create virtual environment

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
```

---

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Setup PostgreSQL

Create database:

```sql
CREATE DATABASE news_ai;
```

Update `.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/news_ai
```

---

### 4. Run server

```bash
uvicorn app.main:app --reload
```

---

## 🔌 API Endpoints

### Base URL

```
http://127.0.0.1:8000/api/v1
```

---

### 📄 Headlines

```
GET /news/headlines?page=1&page_size=10
```

---

### 📄 News Detail

```
GET /news/{id}
```

---

### 📊 Trending Topics

```
GET /news/trending
```

---

### 🤖 AI Insights

```
GET /news/insights
```

---

### 🧠 Entity Distribution

```
GET /news/entities
```

---

## 🧠 NLP Pipeline

1. Clean text
2. Extract keywords
3. Extract entities
4. Generate summary
5. Calculate importance score

---

## ⚠️ Design Principles

* No fake data
* All outputs derived from DB
* Deterministic scoring
* Production-oriented structure

---

## 🧪 Future Improvements

* Redis caching
* Vector similarity search
* Real-time ingestion pipeline
* Background workers (Celery)

---

## 👨‍💻 Author

Ajay Kurchami
