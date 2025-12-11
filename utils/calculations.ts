import { Expense, CategoryTotal } from "@/types";

export const calculateTotals = (expenses: Expense[]) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const dailyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfDay)
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfWeek)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  const yearlyTotal = expenses
    .filter((e) => new Date(e.date) >= startOfYear)
    .reduce((sum, e) => sum + e.amount, 0);

  return { dailyTotal, weeklyTotal, monthlyTotal, yearlyTotal };
};

export const getCategoryTotals = (expenses: Expense[]): CategoryTotal[] => {
  const totals = new Map<string, { total: number; count: number }>();
  let grandTotal = 0;

  expenses.forEach((expense) => {
    const current = totals.get(expense.category) || { total: 0, count: 0 };
    totals.set(expense.category, {
      total: current.total + expense.amount,
      count: current.count + 1,
    });
    grandTotal += expense.amount;
  });

  return Array.from(totals.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const calculateAverages = (expenses: Expense[]) => {
  if (expenses.length === 0) {
    return { daily: 0, weekly: 0, monthly: 0 };
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const dates = expenses.map((e) => new Date(e.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const daysDiff = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));

  return {
    daily: total / daysDiff,
    weekly: (total / daysDiff) * 7,
    monthly: (total / daysDiff) * 30,
  };
};

export const getSpendingTrend = (expenses: Expense[], days: number = 30) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days);

  const dailyTotals = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    dailyTotals.set(dateStr, 0);
  }

  expenses.forEach((expense) => {
    const dateStr = expense.date.split("T")[0];
    if (dailyTotals.has(dateStr)) {
      dailyTotals.set(dateStr, dailyTotals.get(dateStr)! + expense.amount);
    }
  });

  return Array.from(dailyTotals.entries()).map(([date, amount]) => ({
    date,
    amount,
  }));
};

export const predictNextMonthSpending = (expenses: Expense[]): number => {
  const lastThreeMonths = expenses.filter((e) => {
    const date = new Date(e.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return date >= threeMonthsAgo;
  });

  if (lastThreeMonths.length === 0) return 0;

  const total = lastThreeMonths.reduce((sum, e) => sum + e.amount, 0);
  return total / 3;
};
