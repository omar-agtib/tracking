"use client";

import { CategoryTotal } from "@/types";
import { COLORS, CURRENCY } from "@/utils/constants";

interface TopCategoriesProps {
  categories: CategoryTotal[];
  limit?: number;
}

export default function TopCategories({
  categories,
  limit = 5,
}: TopCategoriesProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Categories
      </h3>
      <div className="space-y-3">
        {categories.slice(0, limit).map((ct, idx) => (
          <div key={ct.category} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block">
                  {ct.category}
                </span>
                <span className="text-xs text-gray-400">
                  {ct.count} transaction{ct.count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-sm font-semibold text-gray-900">
                {ct.total.toFixed(2)} {CURRENCY}
              </p>
              <p className="text-xs text-gray-400">
                {ct.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
