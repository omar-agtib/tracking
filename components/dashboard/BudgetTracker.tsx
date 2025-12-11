"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Target } from "lucide-react";
import { CategoryTotal } from "@/types";
import { CURRENCY, CATEGORIES } from "@/utils/constants";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface Budget {
  category: string;
  limit: number;
}

interface BudgetTrackerProps {
  categoryTotals: CategoryTotal[];
}

export default function BudgetTracker({ categoryTotals }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES[0]
  );
  const [budgetAmount, setBudgetAmount] = useState("");

  const addBudget = () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) return;

    const newBudget: Budget = {
      category: selectedCategory,
      limit: parseFloat(budgetAmount),
    };

    setBudgets([
      ...budgets.filter((b) => b.category !== selectedCategory),
      newBudget,
    ]);
    setShowBudgetModal(false);
    setBudgetAmount("");
  };

  const getBudgetStatus = (category: string) => {
    const budget = budgets.find((b) => b.category === category);
    if (!budget) return null;

    const spent =
      categoryTotals.find((ct) => ct.category === category)?.total || 0;
    const percentage = (spent / budget.limit) * 100;

    return {
      spent,
      limit: budget.limit,
      percentage,
      status:
        percentage >= 100 ? "over" : percentage >= 80 ? "warning" : "good",
    };
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Budgets
          </h3>
        </div>
        <Button size="sm" onClick={() => setShowBudgetModal(true)}>
          Set Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          No budgets set. Click{" "}
          <strong>
            <em>Set Budget</em>
          </strong>
          Set Budget to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget.category);
            if (!status) return null;

            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {budget.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {status.spent.toFixed(2)} / {status.limit.toFixed(2)}{" "}
                      {CURRENCY}
                    </span>
                    {status.status === "good" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {status.status === "warning" && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    {status.status === "over" && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status.status === "good"
                        ? "bg-green-500"
                        : status.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {status.percentage.toFixed(1)}% of budget used
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Set Category Budget"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as string)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Budget Limit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {CURRENCY}
              </span>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowBudgetModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={addBudget} fullWidth>
              Set Budget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
