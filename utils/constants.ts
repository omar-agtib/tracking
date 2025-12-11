export const CATEGORIES = [
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
] as const;

export const STORAGE_KEYS = {
  EXPENSES: "finance_tracker_expenses",
  SETTINGS: "finance_tracker_settings",
  BUDGETS: "finance_tracker_budgets",
  GOALS: "finance_tracker_goals",
} as const;

export const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
  "#f43f5e",
  "#6366f1",
];

export const CURRENCY = "MAD";

export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
};
