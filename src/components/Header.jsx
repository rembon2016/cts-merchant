import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="px-4 flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-[rgba(0,47,108,0.08)] text-primary dark:bg-slate-700 dark:text-blue-500 grid place-items-center font-semibold">
          {user?.name[0]}
        </div>
        <div className="text-sm leading-tight">
          <p className="text-slate-500 dark:text-slate-300 text-sm">
            Selamat Datang
          </p>
          <p className="font-semibold dark:text-blue-400 text-primary">
            {user?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-soft"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-slate-700 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="5" strokeWidth="1.75" />
              <path
                d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                strokeWidth="1.75"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-slate-700 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                strokeWidth="1.75"
              />
            </svg>
          )}
        </button>
        {/* <button
          className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-soft"
          aria-label="Cari"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-slate-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </button> */}
        <Link to="/notification">
          <button
            className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-soft"
            aria-label="Notifikasi"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-slate-700 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
              />
            </svg>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
