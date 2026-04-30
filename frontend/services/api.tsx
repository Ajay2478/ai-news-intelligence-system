/**
 * Centralized API service layer
 * - Handles base URL
 * - Timeout protection
 * - Strong typing (NO any)
 * - Runtime validation
 * - Production-ready
 */

import { NewsItem } from "@/types/news";

/**
 * Base URL (FIXED: includes /api/v1)
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/**
 * Generic fetch wrapper
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }

    throw new Error("Network error: Unable to connect to API");
  } finally {
    clearTimeout(id);
  }
}

/**
 * TYPES
 */
export type HeadlinesResponse = {
  total: number;
  page: number;
  page_size: number | null;
  items: NewsItem[];
};

export type TrendingTopic = {
  topic: string;
  count: number;
};

export type InsightsResponse = {
  insight: string;
};

export type EntityDistribution = {
  name: string;
  value: number;
};

/**
 * ===============================
 * TYPE GUARD
 * ===============================
 */
function isHeadlinesResponse(data: unknown): data is HeadlinesResponse {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return "items" in obj && Array.isArray(obj.items);
}

/**
 * ===============================
 * HEADLINES
 * ===============================
 */
export async function fetchHeadlines(): Promise<HeadlinesResponse> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/news/headlines`
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `API Error (${res.status}): ${
          text || "Failed to fetch headlines"
        }`
      );
    }

    const data: unknown = await res.json();

    if (isHeadlinesResponse(data)) {
      return {
        total: data.total ?? data.items.length,
        page: data.page ?? 1,
        page_size: data.page_size ?? null,
        items: data.items,
      };
    }

    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("fetchHeadlines error:", error);

    return {
      total: 0,
      page: 1,
      page_size: null,
      items: [],
    };
  }
}

/**
 * ===============================
 * TRENDING
 * ===============================
 */
export async function fetchTrending(): Promise<TrendingTopic[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/news/trending`
    );

    if (!res.ok) {
      throw new Error(`Failed trending (${res.status})`);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid trending format");
    }

    return data as TrendingTopic[];
  } catch (error) {
    console.error("fetchTrending error:", error);
    return [];
  }
}

/**
 * ===============================
 * INSIGHTS
 * ===============================
 */
export async function fetchInsights(): Promise<InsightsResponse> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/news/insights`
    );

    if (!res.ok) {
      throw new Error(`Failed insights (${res.status})`);
    }

    const data: unknown = await res.json();

    if (typeof data === "string") {
      return { insight: data };
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "insight" in data &&
      typeof (data as { insight: unknown }).insight === "string"
    ) {
      return data as InsightsResponse;
    }

    throw new Error("Invalid insights format");
  } catch (error) {
    console.error("fetchInsights error:", error);

    return {
      insight: "Unable to generate insights at the moment.",
    };
  }
}

/**
 * ===============================
 * ENTITY DISTRIBUTION
 * ===============================
 */
export async function fetchEntities(): Promise<EntityDistribution[]> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/news/entities`
    );

    if (!res.ok) {
      throw new Error(`Failed entities (${res.status})`);
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid entity format");
    }

    return data as EntityDistribution[];
  } catch (err) {
    console.error("fetchEntities error:", err);
    return [];
  }
}

export async function fetchNewsById(id: number): Promise<NewsItem | null> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/news/${id}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch news (${res.status})`);
    }

    const data: unknown = await res.json();

    if (data && typeof data === "object" && "id" in data) {
      return data as NewsItem;
    }

    return null;
  } catch (error) {
    console.error("fetchNewsById error:", error);
    return null;
  }
}