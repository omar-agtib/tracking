"use client";

import { useState } from "react";
import { CATEGORIES } from "@/utils/constants";

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategoryPicker({
  value,
  onChange,
}: CategoryPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-full px-4 py-3 text-base text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between"
        >
          <span>{value}</span>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showPicker && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setShowPicker(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  value === cat
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
