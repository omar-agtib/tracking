"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  TrendingUp,
  Calendar,
  PieChart,
  DollarSign,
  Edit2,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// =======================
// 📂 TYPES & INTERFACES
// =======================

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

// =======================
// 📂 UTILS & STORAGE
// =======================

const STORAGE_KEY = "finance_tracker_expenses";

const storageUtils = {
  getExpenses: (): Expense[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Failed to save expenses:", error);
    }
  },

  addExpense: (expense: Expense): void => {
    const expenses = storageUtils.getExpenses();
    expenses.unshift(expense);
    storageUtils.saveExpenses(expenses);
  },

  updateExpense: (id: string, updates: Partial<Expense>): void => {
    const expenses = storageUtils.getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      storageUtils.saveExpenses(expenses);
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = storageUtils.getExpenses();
    const filtered = expenses.filter((e) => e.id !== id);
    storageUtils.saveExpenses(filtered);
  },
};

const CATEGORIES = [
  "Food",
  "Coffee",
  "Transport",
  "Gym",
  "Groceries",
  "Shopping",
  "Subscriptions",
  "Entertainment",
  "Health",
  "Education",
  "Gifts",
  "Other",
];

// =======================
// 📂 CALCULATION UTILITIES
// =======================

const calculateTotals = (expenses: Expense[]) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const dailyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfDay)
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfWeek)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  return { dailyTotal, weeklyTotal, monthlyTotal };
};

const getCategoryTotals = (expenses: Expense[]): CategoryTotal[] => {
  const totals = new Map<string, number>();
  let grandTotal = 0;

  expenses.forEach((expense) => {
    const current = totals.get(expense.category) || 0;
    totals.set(expense.category, current + expense.amount);
    grandTotal += expense.amount;
  });

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

// =======================
// 📂 MAIN APP COMPONENT
// =======================

export default function FinanceTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  // Add this state at the top with other states
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ amount?: string }>({});

  useEffect(() => {
    const loadedExpenses = storageUtils.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoaded(true);

    if (loadedExpenses.length === 0) {
      setShowOnboarding(true);
    }

    const now = new Date();
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setDate(localDateTime);
  }, []);

  const handleSubmit = () => {
    const newErrors: { amount?: string } = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const expenseId =
      editingExpense?.id ||
      `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expenseDate = date || new Date().toISOString();

    const expense: Expense = {
      id: expenseId,
      amount: numAmount,
      date: expenseDate,
      category,
      notes,
    };

    if (editingExpense) {
      storageUtils.updateExpense(expense.id, expense);
      setExpenses(storageUtils.getExpenses());
    } else {
      storageUtils.addExpense(expense);
      setExpenses(storageUtils.getExpenses());
    }

    resetForm();
    setShowOnboarding(false);
  };

  const resetForm = () => {
    setAmount("");
    const now = new Date();
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setDate(localDateTime);
    setCategory(CATEGORIES[0]);
    setNotes("");
    setIsFormOpen(false);
    setEditingExpense(null);
    setErrors({});
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDate(new Date(expense.date).toISOString().slice(0, 16));
    setCategory(expense.category);
    setNotes(expense.notes);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      storageUtils.deleteExpense(id);
      setExpenses(storageUtils.getExpenses());
    }
  };

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const { dailyTotal, weeklyTotal, monthlyTotal } = calculateTotals(expenses);
  const categoryTotals = getCategoryTotals(expenses);

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dailyChartData = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount: expenses
      .filter((e) => e.date.startsWith(date))
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Finance Tracker
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your expenses effortlessly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Finance Tracker! 👋
                </h2>
                <p className="text-blue-100 mb-4">
                  Start tracking your expenses and gain insights into your
                  spending habits.
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Add Your First Expense
                </button>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="text-blue-100 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Today</h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {dailyTotal.toFixed(2)} MAD
            </p>
            <p className="text-xs text-gray-400 mt-1">Daily spending</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">This Week</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {weeklyTotal.toFixed(2)} MAD
            </p>
            <p className="text-xs text-gray-400 mt-1">Weekly spending</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <PieChart className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {monthlyTotal.toFixed(2)} MAD
            </p>
            <p className="text-xs text-gray-400 mt-1">Monthly spending</p>
          </div>
        </div>

        {/* Charts */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Trend */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                7-Day Spending Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(2)} MAD`,
                      "Amount",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={categoryTotals.slice(0, 8).map((ct) => ({
                      ...ct,
                      name: ct.category,
                      value: ct.total,
                    }))}
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
                    {categoryTotals.slice(0, 8).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} MAD`}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Totals & Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Totals */}
          {categoryTotals.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Categories
              </h3>
              <div className="space-y-3">
                {categoryTotals.slice(0, 5).map((ct, idx) => (
                  <div
                    key={ct.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {ct.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {ct.total.toFixed(2)} MAD
                      </p>
                      <p className="text-xs text-gray-400">
                        {ct.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          <div
            className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${
              categoryTotals.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Expenses
              </h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExpenses.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  No expenses yet. Add your first one!
                </p>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {expense.amount.toFixed(2)} MAD
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {expense.notes && (
                        <p className="text-xs text-gray-600 mt-1">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Expense Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    MAD
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className={`w-full pl-16 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.amount
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                    className="w-full px-4 py-3 text-base text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between"
                  >
                    <span>{category}</span>
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

                  {showCategoryPicker && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setShowCategoryPicker(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                            category === cat
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Add any additional details..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  {editingExpense ? "Update" : "Add"} Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
