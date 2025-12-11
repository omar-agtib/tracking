// =======================
// 📂 TYPES & INTERFACES
// =======================

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly";
}

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export interface Budget {
  category: string;
  limit: number;
  period: "daily" | "weekly" | "monthly";
}

export interface SpendingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterOptions {
  category?: string;
  dateRange?: DateRange;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  tags?: string[];
}

export interface AppSettings {
  currency: string;
  theme: "light" | "dark";
  budgets: Budget[];
  goals: SpendingGoal[];
}
