"use client";

/**
 * NewsCard (Production Ready)
 * --------------------------
 * Fixes:
 * - Correct router (App Router)
 * - Safe navigation
 * - Strong typing
 * - Clean UX behavior
 */

import { useRouter } from "next/navigation";
import { NewsItem } from "@/types/news";

interface Props {
  item: NewsItem;
  onEntityClick?: (entity: string) => void;
}

export default function NewsCard({ item, onEntityClick }: Props) {
  const router = useRouter();

  /**
   * Importance (backend already 0–100)
   */
  const importanceScore = Math.round(item.importance ?? 0);

  /**
   * Safe entity flattening
   */
  const flatEntities: string[] = item.entities
    ? Object.values(item.entities).flatMap((arr) =>
        Array.isArray(arr) ? arr : []
      )
    : [];

  /**
   * Importance styling
   */
  const getImportanceStyle = (value: number) => {
    if (value >= 80) {
      return "bg-red-50 text-red-600 border border-red-100";
    }
    if (value >= 50) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-100";
    }
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  /**
   * Safe date formatting
   */
  const formatDate = (date?: string) => {
    if (!date) return "Recent";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Recent";

    return parsed.toLocaleDateString();
  };

  /**
   * Navigation handler
   */
  const handleClick = () => {
    if (!item.id) return;

    // Navigate to detail page
    router.push(`/news/${item.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="
        bg-white rounded-xl border p-5
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-[2px]
        focus:outline-none focus:ring-2 focus:ring-blue-500
        cursor-pointer group
      "
    >
      <div className="flex gap-4">

        {/* Thumbnail */}
        <div
          className="
            w-28 h-20 bg-gray-200 rounded-lg flex-shrink-0
            group-hover:bg-gray-300 transition
          "
        />

        <div className="flex-1 space-y-3">

          {/* Title */}
          <h2
            className="
              text-base font-semibold text-gray-900 leading-snug
              group-hover:text-blue-600 transition-colors
            "
          >
            {item.title || "Untitled"}
          </h2>

          {/* Summary */}
          <p
            className="
              text-sm text-gray-600 leading-relaxed line-clamp-2
            "
          >
            {item.summary || "No summary available."}
          </p>

          {/* Keywords */}
          {item.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.keywords.slice(0, 4).map((k, i) => (
                <span
                  key={`kw-${i}`}
                  className="
                    text-xs px-2 py-1 rounded-md
                    bg-gray-100 text-gray-600
                  "
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between pt-1">

            <span
              className={`
                text-xs px-2 py-1 rounded-md font-medium
                ${getImportanceStyle(importanceScore)}
              `}
            >
              Importance {importanceScore}
            </span>

            <span className="text-xs text-gray-400">
              {formatDate(item.published_at || item.created_at)}
            </span>
          </div>

          {/* Entities */}
          {flatEntities.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {flatEntities.slice(0, 4).map((e, i) => (
                <span
                  key={`ent-${i}`}
                  onClick={(event) => {
                    event.stopPropagation(); // prevent navigation
                    onEntityClick?.(e);
                  }}
                  className="
                    text-xs px-2 py-1 rounded-md
                    bg-blue-50 text-blue-600
                    hover:bg-blue-100 transition
                    cursor-pointer
                  "
                >
                  {e}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}