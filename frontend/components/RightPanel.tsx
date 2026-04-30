"use client";

/**
 * RightPanel (Stable + Type-Safe)
 * -------------------------------
 * Fixes:
 * - Handles string OR object API response
 * - No TypeScript errors
 * - Clean logic
 */

import { useEffect, useState } from "react";
import { fetchTrending, fetchInsights } from "@/services/api";
import EntityChart from "@/components/EntityChart";

type TrendingItem = {
  topic: string;
  count: number;
};

interface Props {
  setEntityFilter: (value: string | null) => void;
}

export default function RightPanel({ setEntityFilter }: Props) {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [insight, setInsight] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [t, i] = await Promise.all([
          fetchTrending(),
          fetchInsights(),
        ]);

        setTrending(t);

        /**
         * CRITICAL FIX:
         * Handle BOTH possible API responses
         */
        if (typeof i === "string") {
          setInsight(i);
        } else if (
          i &&
          typeof i === "object" &&
          "insight" in i &&
          typeof i.insight === "string"
        ) {
          setInsight(i.insight);
        } else {
          setInsight("");
        }

      } catch (err) {
        console.error("RightPanel error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const entityData = trending.slice(0, 4).map((item) => ({
    name: item.topic,
    value: item.count,
  }));

  return (
    <div className="space-y-6">

      {/* TRENDING */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-3">Trending Topics</h3>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : trending.length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          trending.map((item, i) => {
            const max = trending[0]?.count || 1;
            const width = (item.count / max) * 100;

            return (
              <div
                key={i}
                className="mb-3 cursor-pointer group"
                onClick={() => setEntityFilter(item.topic)}
              >
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="group-hover:text-blue-600">
                    #{item.topic}
                  </span>
                  <span>{item.count}</span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full bg-blue-500 group-hover:bg-blue-600"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ENTITY CHART */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-3">Entity Distribution</h3>

        {loading ? (
          <p className="text-sm text-gray-400">Loading chart...</p>
        ) : (
          <EntityChart
            data={entityData}
            onSelect={(entity) => setEntityFilter(entity)}
          />
        )}
      </div>

      {/* INSIGHTS */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-2">AI Insights</h3>

        {loading ? (
          <p className="text-sm text-gray-400">Analyzing...</p>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            {insight || "No insights available"}
          </p>
        )}
      </div>

    </div>
  );
}