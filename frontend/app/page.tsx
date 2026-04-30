"use client";

/**
 * Dashboard Page (FINAL - Production Ready)
 * ----------------------------------------
 * - Uses real backend data
 * - No fake stats
 * - Fully type-safe
 * - Stable filtering + UI
 */

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import StatsCard from "@/components/StatsCard";
import NewsFeed from "@/components/NewsFeed";
import RightPanel from "@/components/RightPanel";
import Skeleton from "@/components/Skeleton";

import { fetchHeadlines, HeadlinesResponse } from "@/services/api";

export default function Home() {
  // ================= STATE =================
  const [data, setData] = useState<HeadlinesResponse>({
    total: 0,
    page: 1,
    page_size: null,
    items: [],
  });

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [entityFilter, setEntityFilter] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH =================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchHeadlines();

        console.log("TOTAL:", res.total);
        console.log("ITEMS:", res.items.length);

        setData(res);
      } catch (err: unknown) {
        console.error("FETCH ERROR:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ================= DERIVED STATS =================

  const totalArticles = data.total ?? data.items.length;

  const topicsSet = new Set<string>();
  data.items.forEach((item) => {
    item.keywords?.forEach((k) => {
      if (k) topicsSet.add(k.toLowerCase());
    });
  });
  const topicsCovered = topicsSet.size;

  const entitiesSet = new Set<string>();
  data.items.forEach((item) => {
    Object.values(item.entities || {}).forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach((e) => {
          if (e) entitiesSet.add(e.toLowerCase());
        });
      }
    });
  });
  const entitiesDetected = entitiesSet.size;

  const timeSavedHours = Math.round((totalArticles * 2) / 60);

  // ================= RESET =================
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setEntityFilter(null);
  };

  // ================= UI =================
  return (
    <div className="space-y-6">

      {/* NAVBAR */}
      <Navbar search={search} setSearch={setSearch} />

      {/* LIVE LABEL */}
      <p className="text-xs text-gray-400 px-1">
        Live data from database
      </p>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Articles"
          value={totalArticles.toLocaleString()}
        />
        <StatsCard
          title="Topics Covered"
          value={topicsCovered.toString()}
        />
        <StatsCard
          title="Entities Detected"
          value={entitiesDetected.toString()}
        />
        <StatsCard
          title="Time Saved"
          value={`${timeSavedHours} hrs`}
        />
      </div>

      {/* ACTIVE FILTERS */}
      {(search || category !== "All" || entityFilter) && (
        <div className="flex items-center justify-between bg-white border rounded-lg px-4 py-2 text-sm">
          <div className="flex gap-3 flex-wrap text-gray-600">

            {search && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                Search: &quot;{search}&quot;
              </span>
            )}

            {category !== "All" && (
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
                Category: {category}
              </span>
            )}

            {entityFilter && (
              <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">
                Entity: {entityFilter}
              </span>
            )}

          </div>

          <button
            onClick={resetFilters}
            className="text-xs text-red-500 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-4 gap-6">

        {/* NEWS FEED */}
        <div className="col-span-3 space-y-4">

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="p-4 bg-red-100 text-red-600 rounded-lg border">
              {error}
            </div>
          )}

          {!loading && !error && data.items.length === 0 && (
            <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
              No data available
            </div>
          )}

          {!loading && !error && data.items.length > 0 && (
            <NewsFeed
              data={data.items}
              search={search}
              category={category}
              setCategory={setCategory}
              entityFilter={entityFilter}
              setEntityFilter={setEntityFilter}
            />
          )}

        </div>

        {/* RIGHT PANEL */}
        <RightPanel setEntityFilter={setEntityFilter} />

      </div>

    </div>
  );
}