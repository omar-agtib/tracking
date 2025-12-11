"use client";

import {
  PlusCircle,
  DollarSign,
  Download,
  Upload,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onAddExpense: () => void;
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  onAddExpense,
  onExport,
  onImport,
  onSettings,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Finance Tracker
              </h1>
              <p className="text-sm text-gray-500">
                Manage your expenses effortlessly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onToggleDarkMode}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={onExport}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onImport}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Import Data"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={onSettings}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onAddExpense}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onToggleDarkMode();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span>Toggle Dark Mode</span>
            </button>
            <button
              onClick={() => {
                onExport();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={() => {
                onImport();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Import Data</span>
            </button>
            <button
              onClick={() => {
                onSettings();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
