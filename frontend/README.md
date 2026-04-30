# 📰 AI News Intelligence Frontend

Next.js frontend for AI-powered News Intelligence Dashboard.

---

## 🚀 Overview

Interactive dashboard for analyzing news:

* Headlines feed
* AI-generated summaries
* Entity extraction
* Trending topics
* Real-time analytics

---

## 🧱 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**

---

## ⚙️ Setup

```bash
npm install
npm run dev
```

---

## 🌐 Environment

Create `.env.local`

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

---

## 📂 Structure

```
app/
├── page.tsx           # dashboard
├── news/[id]/page.tsx # detail page

components/
├── NewsCard.tsx
├── NewsFeed.tsx
├── RightPanel.tsx
├── StatsCard.tsx
```

---

## 📊 Features

* Real-time stats (no fake data)
* Entity filtering
* Search (frontend)
* Pagination support
* Detail page navigation

---

## ⚠️ Notes

* All data comes from backend APIs
* No mocked or hardcoded values

---

## 🚀 Future Improvements

* Server-side search
* Related news system
* Auth system
* Bookmarking

---

## 👨‍💻 Author

Ajay Kurchami 
