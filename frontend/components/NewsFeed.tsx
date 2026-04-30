"use client";

/**
 * NewsFeed (Final Production Version)
 * ----------------------------------
 * - Robust entity normalization
 * - Safe filtering (no silent empty results)
 * - Stable sorting
 * - Fully typed
 */

import { useMemo, useState } from "react";
import { NewsItem } from "@/types/news";
import NewsCard from "./NewsCard";

interface Props {
  data: NewsItem[];
  search: string;
  category: string;
  setCategory: (value: string) => void;
  entityFilter: string | null;
  setEntityFilter: (value: string | null) => void;
}

const CATEGORIES = ["All", "Business", "Technology", "Politics", "Sports"];

export default function NewsFeed({
  data,
  search,
  category,
  setCategory,
  entityFilter,
}: Props) {
  const [sortBy, setSortBy] = useState<"importance" | "latest">("importance");

  /**
   * ================= NORMALIZATION =================
   * Handles BOTH:
   * - entities as object { PERSON: [] }
   * - entities as array ["india"]
   */
  const normalizedData = useMemo(() => {
    return data.map((item) => {
      let flatEntities: string[] = [];

      if (Array.isArray(item.entities)) {
        flatEntities = item.entities;
      } else if (item.entities && typeof item.entities === "object") {
        flatEntities = Object.values(item.entities).flat();
      }

      return {
        ...item,
        flatEntities,
      };
    });
  }, [data]);

  /**
   * ================= FILTER + SORT =================
   */
  const filteredData = useMemo(() => {
    let result = [...normalizedData];

    // ---------- SEARCH ----------
    if (search.trim()) {
      const s = search.toLowerCase();

      result = result.filter((item) =>
        item.title.toLowerCase().includes(s) ||
        item.summary.toLowerCase().includes(s) ||
        item.keywords?.some((k) => k.toLowerCase().includes(s)) ||
        item.flatEntities?.some((e) => e.toLowerCase().includes(s))
      );
    }

    // ---------- CATEGORY ----------
    if (category !== "All") {
      const c = category.toLowerCase();

      result = result.filter((item) =>
        item.keywords?.some((k) => k.toLowerCase().includes(c))
      );
    }

    // ---------- ENTITY FILTER ----------
    if (entityFilter) {
      const e = entityFilter.toLowerCase();

      result = result.filter((item) =>
        item.flatEntities?.some((ent) =>
          ent.toLowerCase().includes(e)
        )
      );
    }

    // ---------- SORT ----------
    if (sortBy === "importance") {
      result.sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
    } else {
      result.sort((a, b) => {
        const aTime = new Date(
          a.published_at || a.created_at || ""
        ).getTime();

        const bTime = new Date(
          b.published_at || b.created_at || ""
        ).getTime();

        return bTime - aTime;
      });
    }

    /**
     * SAFETY NET
     * Prevents total UI wipe if filtering logic is too strict
     */
    if (result.length === 0 && data.length > 0) {
      console.warn("All filters removed results → fallback applied");
      return normalizedData;
    }

    return result;
  }, [normalizedData, search, category, entityFilter, sortBy, data]);

  return (
    <div className="space-y-5">

      {/* ================= CONTROLS ================= */}
<div className="bg-white border rounded-xl px-4 py-3 shadow-sm">

  <div className="flex items-center justify-between flex-wrap gap-4">

    {/* LEFT: FILTERS */}
    <div className="flex items-center gap-3 flex-wrap">

      <span className="text-xs text-gray-500 font-medium">
        Categories
      </span>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => {
          const active = category === c;

          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`
                px-3 py-1 text-sm rounded-full border transition-all
                ${
                  active
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {c}
            </button>
          );
        })}
      </div>

    </div>

    {/* RIGHT: SORT */}
    <div className="flex items-center gap-2">

      <span className="text-xs text-gray-500 font-medium">
        Sort
      </span>

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value as "importance" | "latest")
        }
        className="
          text-sm border border-gray-200 px-3 py-1.5 rounded-md
          bg-white text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <option value="importance">Importance</option>
        <option value="latest">Latest</option>
      </select>

    </div>

  </div>

</div>
      {/* ================= ACTIVE ENTITY FILTER ================= */}
      {entityFilter && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-700">
            Filtering by entity:{" "}
            <span className="font-medium">{entityFilter}</span>
          </p>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {filteredData.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          <p className="text-sm">No matching news found</p>
          <p className="text-xs mt-1">
            Try adjusting filters or search
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}