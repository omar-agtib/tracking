"use client";

import { X } from "lucide-react";

interface OnboardingBannerProps {
  onAddExpense: () => void;
  onDismiss: () => void;
}

export default function OnboardingBanner({
  onAddExpense,
  onDismiss,
}: OnboardingBannerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Finance Tracker! 👋
            </h2>
            <p className="text-blue-100 mb-4">
              Start tracking your expenses and gain insights into your spending
              habits. Set budgets, create goals, and take control of your
              finances!
            </p>
            <button
              onClick={onAddExpense}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Add Your First Expense
            </button>
          </div>
          <button
            onClick={onDismiss}
            className="text-blue-100 hover:text-white transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
