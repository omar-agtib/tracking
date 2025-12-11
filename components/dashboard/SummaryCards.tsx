"use client";

import { Calendar, TrendingUp, PieChart, Target } from "lucide-react";
import { CURRENCY } from "@/utils/constants";

interface SummaryCardsProps {
  dailyTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal?: number;
  averageDaily?: number;
  prediction?: number;
}

export default function SummaryCards({
  dailyTotal,
  weeklyTotal,
  monthlyTotal,
  yearlyTotal,
  averageDaily,
  prediction,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Today</h3>
          <Calendar className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {dailyTotal.toFixed(2)} {CURRENCY}
        </p>
        <p className="text-xs text-gray-400 mt-1">Daily spending</p>
        {averageDaily !== undefined && (
          <p className="text-xs text-gray-500 mt-2">
            Avg: {averageDaily.toFixed(2)} {CURRENCY}/day
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">This Week</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {weeklyTotal.toFixed(2)} {CURRENCY}
        </p>
        <p className="text-xs text-gray-400 mt-1">Weekly spending</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">This Month</h3>
          <PieChart className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {monthlyTotal.toFixed(2)} {CURRENCY}
        </p>
        <p className="text-xs text-gray-400 mt-1">Monthly spending</p>
        {prediction !== undefined && (
          <p className="text-xs text-gray-500 mt-2">
            Next month est: {prediction.toFixed(2)} {CURRENCY}
          </p>
        )}
      </div>

      {yearlyTotal !== undefined && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">This Year</h3>
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {yearlyTotal.toFixed(2)} {CURRENCY}
          </p>
          <p className="text-xs text-gray-400 mt-1">Yearly spending</p>
        </div>
      )}
    </div>
  );
}
