import { Expense, AppSettings } from "@/types";
import { STORAGE_KEYS } from "./constants";

export const storageUtils = {
  getExpenses: (): Expense[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
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

  getSettings: (): AppSettings | null => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  exportData: (): string => {
    const expenses = storageUtils.getExpenses();
    const settings = storageUtils.getSettings();
    return JSON.stringify({ expenses, settings }, null, 2);
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.expenses) storageUtils.saveExpenses(data.expenses);
      if (data.settings) storageUtils.saveSettings(data.settings);
      return true;
    } catch {
      return false;
    }
  },

  exportToCSV: (expenses: Expense[]): string => {
    const headers = ["Date", "Amount", "Category", "Notes", "Tags"];
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleString(),
      e.amount.toString(),
      e.category,
      e.notes,
      e.tags?.join(";") || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  },

  clearAllData: (): void => {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};
