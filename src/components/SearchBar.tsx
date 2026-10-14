"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";

interface Suggestion {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export default function SearchBar({ variant = "desktop", onNavigate }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [listId] = useState(() => `search-list-${Math.random().toString(36).slice(2)}`);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      onNavigate?.();
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    router.push(`/product/${suggestion.slug}`);
    setShowSuggestions(false);
    onNavigate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && query.length >= 2);
  }, [suggestions, query]);

  const isMobile = variant === "mobile";

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${isMobile ? "h-4 w-4" : "h-4 w-4"}`} />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search products"
            aria-busy={isSearching}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && query.length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={isMobile ? "Search products..." : "Search products..."}
            className={`w-full pl-10 pr-8 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:text-white ${
              isMobile
                ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!isMobile && !query && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hidden sm:block">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-gray-400 font-mono">
                /
              </kbd>
            </span>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div
          id={listId}
          role="listbox"
          aria-label="Product suggestions"
          className={`absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${
            isMobile ? "static mt-2" : ""
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider" aria-hidden="true">
            {isSearching ? "Searching…" : "Suggestions"}
          </div>
          {suggestions.map((s, i) => (
            <button
              key={s._id}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => handleSelect(s)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === selectedIndex
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                {s.imageUrl && (
                  <Image
                    src={s.imageUrl}
                    alt={s.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-gray-500">GH₵ {s.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
