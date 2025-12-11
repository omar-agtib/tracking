"use client";

import { Filter, Search, X } from "lucide-react";
import { useState } from "react";
import { Expense, FilterOptions } from "@/types";
import { CATEGORIES } from "@/utils/constants";
import ExpenseItem from "./ExpenseItem";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onFilter,
}: ExpenseListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const applyFilters = () => {
    const filters: FilterOptions = {
      category: filterCategory !== "all" ? filterCategory : undefined,
      searchTerm: searchTerm || undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    };
    onFilter(filters);
  };

  const clearFilters = () => {
    setFilterCategory("all");
    setSearchTerm("");
    setMinAmount("");
    setMaxAmount("");
    onFilter({});
  };

  const hasActiveFilters =
    filterCategory !== "all" || searchTerm || minAmount || maxAmount;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const filters: FilterOptions = {
                  category:
                    filterCategory !== "all" ? filterCategory : undefined,
                  searchTerm: e.target.value || undefined,
                  minAmount: minAmount ? parseFloat(minAmount) : undefined,
                  maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
                };
                onFilter(filters);
              }}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              hasActiveFilters
                ? "bg-blue-100 text-blue-600"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  applyFilters();
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={minAmount}
                onChange={(e) => {
                  setMinAmount(e.target.value);
                  applyFilters();
                }}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value);
                  applyFilters();
                }}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No expenses found.{" "}
            {hasActiveFilters
              ? "Try adjusting your filters."
              : "Add your first one!"}
          </p>
        ) : (
          expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
