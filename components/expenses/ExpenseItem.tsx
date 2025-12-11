"use client";

import { Edit2, Trash2, Tag, RefreshCw } from "lucide-react";
import { Expense } from "@/types";
import { CURRENCY } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">
            {expense.amount.toFixed(2)} {CURRENCY}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {expense.category}
          </span>
          {expense.isRecurring && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Recurring
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {formatDate(expense.date, true)}
        </p>
        {expense.notes && (
          <p className="text-xs text-gray-600 mt-1 truncate">{expense.notes}</p>
        )}
        {expense.tags && expense.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <Tag className="w-3 h-3 text-gray-400" />
            {expense.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(expense)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
