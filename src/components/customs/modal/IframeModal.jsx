import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const IframeModal = ({ isOpen, url, title, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const iframeRef = useRef(null);
  const loadTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen && url) {
      setIsLoading(true);
      setShowFallback(false);

      // Set loading timeout
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      loadTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        setShowFallback(true);
      }, 7000);

      // Add body overflow hidden
      document.body.classList.add("overflow-hidden");
    } else {
      // Remove body overflow hidden
      document.body.classList.remove("overflow-hidden");

      // Clear timer
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    };
  }, [isOpen, url]);

  const handleIframeLoad = () => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
    setIsLoading(false);
    setShowFallback(false);
  };

  const handleBack = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.history.back();
      } else {
        toast.warning("Tidak dapat kembali (konten tidak mengizinkan).");
      }
    } catch (err) {
      toast(
        "Tidak dapat kembali karena pembatasan cross-origin. Buka di tab baru untuk navigasi."
      );
    }
  };

  const handleClose = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.src = "about:blank";
      } catch (e) {
        console.error("Error clearing iframe:", e);
      }
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overlay-bg" aria-hidden="true" />
      <div className="relative z-50 flex flex-col h-full bg-white dark:bg-slate-800">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-[var(--c-primary)] text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
              title="Kembali"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 className="text-base font-semibold">{title || "Memuat..."}</h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-sm transition-colors"
            >
              Buka di tab baru
            </a>
            <button
              onClick={handleClose}
              className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
              title="Tutup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 relative">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 z-10">
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Memuat...
                </span>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title={title}
          />

          {/* Fallback */}
          {showFallback && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/95 dark:bg-slate-800/95 z-20 text-center">
              <div>
                <p className="mb-3 text-slate-700 dark:text-slate-300">
                  Konten tidak dapat ditampilkan di dalam aplikasi (mungkin
                  situs menolak iframe).
                </p>
                <div className="flex gap-2 justify-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-[var(--c-primary)] text-white hover:bg-[var(--c-primary)]/90 transition-colors"
                  >
                    Buka di tab baru
                  </a>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IframeModal;
