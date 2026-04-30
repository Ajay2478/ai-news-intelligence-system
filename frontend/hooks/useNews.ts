import { useEffect, useState } from "react";
import { fetchNews, NewsItem } from "@/lib/api";

/**
 * useNews Hook (Production-Ready)
 * --------------------------------
 * Handles:
 * - Data fetching
 * - Loading state
 * - Error handling
 * - Request cancellation
 */
export function useNews(page: number = 1) {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // prevents state update after unmount

    async function loadNews() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchNews(page, 10);

        if (!isMounted) return;

        setData(res.items);
      } catch (err: unknown) {
        if (!isMounted) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNews();

    // Cleanup function (IMPORTANT)
    return () => {
      isMounted = false;
    };
  }, [page]);

  return { data, loading, error };
}