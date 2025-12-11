import { useState, useEffect, useCallback } from "react";
import { Expense, FilterOptions } from "@/types";
import { storageUtils } from "@/utils/storage";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedExpenses = storageUtils.getExpenses();
    setExpenses(loadedExpenses);
    setFilteredExpenses(loadedExpenses);
    setIsLoaded(true);
  }, []);

  const refresh = useCallback(() => {
    const updated = storageUtils.getExpenses();
    setExpenses(updated);
    setFilteredExpenses(updated);
  }, []);

  const addExpense = useCallback(
    (expense: Expense) => {
      storageUtils.addExpense(expense);
      refresh();
    },
    [refresh]
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Expense>) => {
      storageUtils.updateExpense(id, updates);
      refresh();
    },
    [refresh]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      storageUtils.deleteExpense(id);
      refresh();
    },
    [refresh]
  );

  const filterExpenses = useCallback(
    (filters: FilterOptions) => {
      let filtered = [...expenses];

      if (filters.category && filters.category !== "all") {
        filtered = filtered.filter((e) => e.category === filters.category);
      }

      if (filters.dateRange) {
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        filtered = filtered.filter((e) => {
          const date = new Date(e.date);
          return date >= start && date <= end;
        });
      }

      if (filters.minAmount !== undefined) {
        filtered = filtered.filter((e) => e.amount >= filters.minAmount!);
      }
      if (filters.maxAmount !== undefined) {
        filtered = filtered.filter((e) => e.amount <= filters.maxAmount!);
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.notes.toLowerCase().includes(term) ||
            e.category.toLowerCase().includes(term)
        );
      }

      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter((e) =>
          e.tags?.some((tag) => filters.tags!.includes(tag))
        );
      }

      setFilteredExpenses(filtered);
    },
    [expenses]
  );

  const clearFilters = useCallback(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  return {
    expenses,
    filteredExpenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    filterExpenses,
    clearFilters,
  };
}
