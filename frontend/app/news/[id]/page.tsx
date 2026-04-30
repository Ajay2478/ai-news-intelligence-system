"use client";

/**
 * News Detail Page (Production Ready)
 * ----------------------------------
 * Fixes:
 * - Safe params handling
 * - Proper JSX structure
 * - Type-safe entity rendering
 * - Stable loading flow
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { fetchNewsById } from "@/services/api";
import { NewsItem } from "@/types/news";

export default function NewsDetailPage() {
  const params = useParams();

  /**
   * Safe ID extraction
   */
  const id =
    typeof params.id === "string" ? Number(params.id) : NaN;

  const [data, setData] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch data
   */
  useEffect(() => {
    async function load() {
      if (!id || isNaN(id)) return;

      setLoading(true);

      const res = await fetchNewsById(id);
      setData(res);

      setLoading(false);
    }

    load();
  }, [id]);

  /**
   * Loading state
   */
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  /**
   * Not found state
   */
  if (!data) {
    return (
      <div className="p-6 text-red-500">
        News not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">
        {data.title}
      </h1>

      {/* Meta */}
      <div className="text-sm text-gray-500">
        Published:{" "}
        {data.published_at
          ? new Date(data.published_at).toLocaleString()
          : "Unknown"}
      </div>

      {/* Importance */}
      <div className="text-sm">
        Importance:{" "}
        <span className="font-semibold">
          {data.importance ?? 0}
        </span>
      </div>

      {/* Summary */}
      <p className="text-gray-700 leading-relaxed">
        {data.summary || "No summary available."}
      </p>

      {/* Keywords */}
      {data.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((k, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {k}
            </span>
          ))}
        </div>
      )}

      {/* Entities */}
      {data.entities && Object.keys(data.entities).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Entities</h3>

          {Object.entries(data.entities).map(
            ([type, values]: [string, string[]]) => (
              <div key={type}>
                <span className="text-xs text-gray-400">
                  {type}
                </span>

                <div className="flex flex-wrap gap-2 mt-1">
                  {values.map((v: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

    </div>
  );
}