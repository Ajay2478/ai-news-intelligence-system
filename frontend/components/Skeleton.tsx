"use client";

/**
 * Skeleton Loader
 */

export default function Skeleton() {
  return (
    <div className="bg-white p-4 rounded-xl border animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-20 bg-gray-200 rounded-lg" />

        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}