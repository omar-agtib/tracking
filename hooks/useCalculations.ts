import { useMemo } from "react";
import { Expense } from "@/types";
import {
  calculateTotals,
  getCategoryTotals,
  calculateAverages,
  getSpendingTrend,
  predictNextMonthSpending,
} from "@/utils/calculations";

export function useCalculations(expenses: Expense[]) {
  const totals = useMemo(() => calculateTotals(expenses), [expenses]);
  const categoryTotals = useMemo(() => getCategoryTotals(expenses), [expenses]);
  const averages = useMemo(() => calculateAverages(expenses), [expenses]);
  const trend = useMemo(() => getSpendingTrend(expenses, 30), [expenses]);
  const prediction = useMemo(
    () => predictNextMonthSpending(expenses),
    [expenses]
  );

  const last7DaysData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    return last7Days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: expenses
        .filter((e) => e.date.startsWith(date))
        .reduce((sum, e) => sum + e.amount, 0),
    }));
  }, [expenses]);

  return {
    totals,
    categoryTotals,
    averages,
    trend,
    prediction,
    last7DaysData,
  };
}
