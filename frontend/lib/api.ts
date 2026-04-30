/**
 * Central API client
 * Handles all backend communication
 */

const BASE_URL = "http://127.0.0.1:8000";

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  keywords: string[];
  entities: Record<string, string[]>;
  importance: number;
  published_at?: string;
}

export interface NewsResponse {
  total: number;
  page: number;
  page_size: number;
  items: NewsItem[];
}

/**
 * Fetch headlines from backend
 */
export async function fetchNews(
  page: number = 1,
  pageSize: number = 10
): Promise<NewsResponse> {
  const res = await fetch(
    `${BASE_URL}/news/headlines?page=${page}&page_size=${pageSize}`,
    {
      method: "GET",
      cache: "no-store", // always fresh data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}