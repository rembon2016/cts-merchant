import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Beranda",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-9.5Z"
          />
        </svg>
      ),
    },
    {
      path: "/transaction",
      label: "Transaksi",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M3 7h13m0 0-3-3m3 3-3 3M21 17H8m0 0 3-3m-3 3 3 3"
          />
        </svg>
      ),
    },
    {
      path: "/pos",
      label: "POS",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
        >
          <rect
            width="18"
            height="12"
            x="3"
            y="6"
            rx="2"
            ry="2"
            strokeWidth="1.75"
          />
          <path d="M3 10h18" strokeWidth="1.75" />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profil",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 8a7 7 0 0 0-14 0"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0">
      <div className="max-w-sm mx-auto">
        <div className="mx-4 mb-4 rounded-3xl bg-white dark:bg-slate-700 shadow-soft border border-slate-100 dark:border-slate-600 px-2 py-2 grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex flex-col items-center gap-1 py-1"
              >
                <span
                  className={`size-9 grid place-items-center rounded-2xl ${
                    isActive ? "accent-bg" : "bg-slate-100 dark:bg-slate-600"
                  }`}
                >
                  <div
                    className={
                      isActive
                        ? "text-[var(--c-primary)]"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  >
                    {item.icon}
                  </div>
                </span>
                <span
                  className={`text-[11px] ${
                    isActive
                      ? "font-medium text-slate-700 dark:text-slate-300"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
