"use client";

import { useState } from "react";
import { Expense } from "@/types";
import { useExpenses } from "@/hooks/useExpenses";
import { useCalculations } from "@/hooks/useCalculations";
import { storageUtils } from "@/utils/storage";

// Layout Components
import Header from "@/components/layout/Header";
import OnboardingBanner from "@/components/layout/OnboardingBanner";

// Dashboard Components
import SummaryCards from "@/components/dashboard/SummaryCards";
import SpendingTrendChart from "@/components/dashboard/SpendingTrendChart";
import CategoryBreakdownChart from "@/components/dashboard/CategoryBreakdownChart";
import TopCategories from "@/components/dashboard/TopCategories";

// Expense Components
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseForm from "@/components/expenses/ExpenseForm";

// UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// Icons
import { Download, Upload, TrendingUp, AlertCircle } from "lucide-react";
import BudgetTracker from "@/components/dashboard/BudgetTracker";

export default function FinanceTracker() {
  const {
    expenses,
    filteredExpenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    filterExpenses,
  } = useExpenses();

  const { totals, categoryTotals, averages, prediction, last7DaysData } =
    useCalculations(expenses);

  // const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false);
  const showOnboarding =
    isLoaded && expenses.length === 0 && !dismissedOnboarding;

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleSubmitExpense = (expense: Expense) => {
    if (editingExpense) {
      updateExpense(expense.id, expense);
    } else {
      addExpense(expense);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
    setDismissedOnboarding(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  const handleExportJSON = () => {
    const data = storageUtils.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-tracker-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleExportCSV = () => {
    const csv = storageUtils.exportToCSV(expenses);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-tracker-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = storageUtils.importData(content);
        if (success) {
          alert("Data imported successfully! Please refresh the page.");
          window.location.reload();
        } else {
          alert("Failed to import data. Please check the file format.");
        }
      } catch (error) {
        alert("Error importing data. Please ensure the file is valid JSON.");
        console.log("Error ==>", error);
      }
    };
    reader.readAsText(file);
    setShowImportModal(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        onAddExpense={handleAddExpense}
        onExport={() => setShowExportModal(true)}
        onImport={() => setShowImportModal(true)}
        onSettings={() => setShowSettingsModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {showOnboarding && (
        <OnboardingBanner
          onAddExpense={handleAddExpense}
          onDismiss={() => setDismissedOnboarding(true)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <SummaryCards
          dailyTotal={totals.dailyTotal}
          weeklyTotal={totals.weeklyTotal}
          monthlyTotal={totals.monthlyTotal}
          yearlyTotal={totals.yearlyTotal}
          averageDaily={averages.daily}
          prediction={prediction}
        />

        {/* Quick Stats Button */}
        {expenses.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              View Advanced Statistics
            </button>
          </div>
        )}

        {/* Charts */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SpendingTrendChart data={last7DaysData} />
            <CategoryBreakdownChart data={categoryTotals} />
          </div>
        )}

        {/* Budget Tracker */}
        {expenses.length > 0 && (
          <div className="mb-8">
            <BudgetTracker categoryTotals={categoryTotals} />
          </div>
        )}

        {/* Category Totals & Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categoryTotals.length > 0 && (
            <TopCategories categories={categoryTotals} limit={8} />
          )}

          <div
            className={
              categoryTotals.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
            }
          >
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onFilter={filterExpenses}
            />
          </div>
        </div>
      </main>

      {/* Expense Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmitExpense}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingExpense(null);
          }}
        />
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Choose the format to export your financial data:
          </p>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={handleExportJSON}>
              <Download className="w-4 h-4 inline mr-2" />
              Export as JSON
            </Button>
            <Button variant="secondary" fullWidth onClick={handleExportCSV}>
              <Download className="w-4 h-4 inline mr-2" />
              Export as CSV
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            JSON format includes all data and settings. CSV format is compatible
            with Excel.
          </p>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Data"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Warning</p>
              <p>
                Importing will replace all existing data. Make sure to export
                your current data first!
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select JSON file to import:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Modal>

      {/* Advanced Statistics Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Advanced Statistics"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Average Daily Spending
              </h4>
              <p className="text-2xl font-bold text-blue-700">
                {averages.daily.toFixed(2)} MAD
              </p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                Average Weekly Spending
              </h4>
              <p className="text-2xl font-bold text-green-700">
                {averages.weekly.toFixed(2)} MAD
              </p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-900 mb-2">
                Average Monthly Spending
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                {averages.monthly.toFixed(2)} MAD
              </p>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-orange-900 mb-2">
                Next Month Prediction
              </h4>
              <p className="text-2xl font-bold text-orange-700">
                {prediction.toFixed(2)} MAD
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Category Insights
            </h4>
            <div className="space-y-3">
              {categoryTotals.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {cat.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.count} transactions • Avg:{" "}
                      {(cat.total / cat.count).toFixed(2)} MAD
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {cat.total.toFixed(2)} MAD
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Total Summary
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-semibold">{expenses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent (All Time):</span>
                <span className="font-semibold">
                  {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}{" "}
                  MAD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Most Expensive:</span>
                <span className="font-semibold">
                  {Math.max(...expenses.map((e) => e.amount), 0).toFixed(2)} MAD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Least Expensive:</span>
                <span className="font-semibold">
                  {Math.min(...expenses.map((e) => e.amount), 0).toFixed(2)} MAD
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Settings"
        size="md"
      >
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Appearance
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                <p className="text-xs text-gray-500">Toggle dark/light theme</p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="border-b pb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Data Management
            </h4>
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowExportModal(true);
                }}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Backup Data
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowImportModal(true);
                }}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Restore Data
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to delete all data? This action cannot be undone!"
                    )
                  ) {
                    storageUtils.clearAllData();
                    window.location.reload();
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Finance Tracker v2.0</p>
              <p>
                Track expenses, set budgets, and achieve your financial goals.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                All data is stored locally in your browser.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
