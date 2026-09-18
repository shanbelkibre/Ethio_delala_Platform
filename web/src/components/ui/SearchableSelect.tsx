"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  searchThreshold?: number;
  searchPlaceholder?: string;
  noResultsText?: string;
  id?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  icon,
  className = "",
  disabled = false,
  searchThreshold = 5,
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  id,
}: SearchableSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showSearch = options.length > searchThreshold;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery("");
      setFocusedIndex(-1);
    }
  }, [isOpen, showSearch]);

  const handleSelect = (optionValue: string, isOptionDisabled?: boolean) => {
    if (isOptionDisabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      e.preventDefault();
      const targetOption = filteredOptions[focusedIndex];
      if (targetOption && !targetOption.disabled) {
        handleSelect(targetOption.value);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id={selectId}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 dark:bg-[#0b1329]/90 dark:hover:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {(selectedOption?.icon || icon) && (
            <span className="shrink-0 flex items-center justify-center">
              {selectedOption?.icon || icon}
            </span>
          )}
          {selectedOption ? (
            <span className="text-slate-900 dark:text-white font-medium truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 w-full overflow-hidden rounded-2xl bg-white/95 dark:bg-[#111a33]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Conditional Toolbar Search Box (> 5 options) */}
            {showSearch && (
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0b1329]/50">
                <div className="relative flex items-center bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar flex-1">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {noResultsText}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isFocused = focusedIndex === index;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelect(option.value, option.disabled)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                          : isFocused
                          ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      } ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <div className="truncate">
                          <div className="truncate">{option.label}</div>
                          {option.description && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

