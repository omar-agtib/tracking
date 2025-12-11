"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CategoryTotal } from "@/types";
import { COLORS, CURRENCY } from "@/utils/constants";

interface CategoryBreakdownChartProps {
  data: CategoryTotal[];
}

export default function CategoryBreakdownChart({
  data,
}: CategoryBreakdownChartProps) {
  const chartData = data.slice(0, 8).map((ct) => ({
    ...ct,
    name: ct.category,
    value: ct.total,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Category Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percentage }: any) =>
              `${category} ${percentage.toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(2)} ${CURRENCY}`}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
