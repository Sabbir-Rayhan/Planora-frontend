"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Sparkles, X, Loader2 } from "lucide-react";

export default function AISearchBar({
  placeholder = "Search events...",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync input with URL search param on mount and URL changes
  useEffect(() => {
    const searchParam = searchParams.get("search");
    setQuery(searchParam || "");
  }, [searchParams]);

  // fetch AI suggestions
  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce input — wait 500ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preserve existing URL params when searching
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchQuery.trim());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        const selected = suggestions[selectedIndex];
        setQuery(selected);
        handleSearch(selected);
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-20 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm transition-all text-sm"
        />

        {/* Right side icons */}
        <div className="absolute right-3 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          {query && !loading && (
            <button
              onClick={clearSearch}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </div>

      {/* AI Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium text-purple-600">
              AI Suggestions
            </span>
          </div>

          {/* Suggestions List */}
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    selectedIndex === index
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{suggestion}</span>
                  <span className="ml-auto text-xs text-slate-400">↵</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
