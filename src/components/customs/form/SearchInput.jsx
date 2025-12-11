import { useEffect, useRef, useState } from "react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  propsData,
}) {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (propsData) {
      try {
        const stored = sessionStorage.getItem(propsData);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setHistory(parsed.slice(0, 3));
          }
        }
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }
  }, [propsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (term) => {
    if (!propsData || !term?.trim()) return;
    const cleanTerm = term.trim();
    setHistory((prevHistory) => {
      const newHistory = [
        cleanTerm,
        ...prevHistory.filter((h) => h !== cleanTerm),
      ].slice(0, 3);
      sessionStorage.setItem(propsData, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value && value.trim()) {
        saveToHistory(value);
        setShowHistory(false);
        inputRef.current?.blur();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [value, propsData]);

  const removeFromHistory = (term) => {
    if (!propsData) return;
    const newHistory = history.filter((h) => h !== term);
    setHistory(newHistory);
    sessionStorage.setItem(propsData, JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    if (!propsData) return;
    setHistory([]);
    sessionStorage.removeItem(propsData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveToHistory(value);
      setShowHistory(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowHistory(true)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)] focus:border-transparent pl-10"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {showHistory && history.length > 0 && propsData && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Terakhir dicari
            </div>
            <button
              type="button"
              onClick={clearAllHistory}
              className="text-xs text-slate-400 hover:text-red-500 hover:underline transition-colors"
            >
              Hapus Semua
            </button>
          </div>
          {history?.map((item, index) => (
            <div
              key={index}
              className="group flex items-center justify-between w-full border-b border-slate-100 dark:border-slate-700/50 last:border-none hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <button
                type="button"
                className="flex-1 text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 flex items-center gap-3"
                onClick={() => {
                  onChange(item);
                  saveToHistory(item); // Update timestamp/order
                  setShowHistory(false);
                }}
              >
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="break-words line-clamp-2 text-left">
                  {item}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item);
                }}
                className="mr-2 p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Hapus dari riwayat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
