"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types";
import { CATEGORIES, CURRENCY } from "@/utils/constants";
import { getLocalDateTime } from "@/utils/dateUtils";
import CategoryPicker from "./CategoryPicker";
import Button from "../ui/Button";

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  expense,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDate(new Date(expense.date).toISOString().slice(0, 16));
      setCategory(expense.category);
      setNotes(expense.notes);
      setTags(expense.tags?.join(", ") || "");
      setIsRecurring(expense.isRecurring || false);
    } else {
      setDate(getLocalDateTime());
    }
  }, [expense]);

  const handleSubmit = () => {
    const newErrors: { amount?: string } = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const expenseData: Expense = {
      id:
        expense?.id ||
        `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: numAmount,
      date: date || new Date().toISOString(),
      category,
      notes,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      isRecurring,
    };

    onSubmit(expenseData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {CURRENCY}
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

      <CategoryPicker value={category} onChange={setCategory} />

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (optional, comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., work, personal, urgent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="recurring"
          className="text-sm font-medium text-gray-700"
        >
          This is a recurring expense
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} fullWidth>
          {expense ? "Update" : "Add"} Expense
        </Button>
      </div>
    </div>
  );
}
