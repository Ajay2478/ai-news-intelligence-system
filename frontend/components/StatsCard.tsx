"use client";

/**
 * StatsCard (Production Grade)
 * ----------------------------
 * - Supports dynamic numeric + string values
 * - Handles live data indicators
 * - Safe formatting
 * - Future-ready (real analytics)
 */

type Props = {
  title: string;
  value: number | string;   // allow numbers directly
  growth?: string;          // optional now
};

export default function StatsCard({ title, value, growth }: Props) {
  /**
   * Format value safely
   */
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  /**
   * Growth styling
   */
  const getGrowthStyle = () => {
    if (!growth) return "text-gray-400";

    if (growth.toLowerCase() === "live") {
      return "text-blue-500";
    }

    if (growth.startsWith("-")) {
      return "text-red-500";
    }

    return "text-green-500";
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">

      {/* Title */}
      <p className="text-gray-500 text-sm">{title}</p>

      {/* Value */}
      <h2 className="text-2xl font-bold mt-1">
        {formattedValue}
      </h2>

      {/* Growth / Status */}
      {growth && (
        <p className={`text-sm mt-1 ${getGrowthStyle()}`}>
          {growth === "Live" ? "Live Data" : growth}
        </p>
      )}

    </div>
  );
}