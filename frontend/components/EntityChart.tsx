"use client";

/**
 * Entity Distribution Chart (Production Grade)
 * - Proper typing for Recharts
 * - Click interaction support
 * - Center label
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

type EntityData = {
  name: string;
  value: number;
};

interface Props {
  data: EntityData[];
  onSelect?: (entity: string) => void;
}

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

export default function EntityChart({ data, onSelect }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400">No data available</p>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-full h-56">

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            onClick={(data: PieSectorDataItem) => {
  if (onSelect && typeof data.name === "string") {
    onSelect(data.name);
  }
}}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                className="cursor-pointer hover:opacity-80 transition"
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: unknown) => {
              if (typeof value === "number") return value.toString();
              return String(value ?? "");
            }}
            contentStyle={{
              fontSize: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: "12px" }}
          />

        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold text-gray-900">{total}</p>
        </div>
      </div>

    </div>
  );
}