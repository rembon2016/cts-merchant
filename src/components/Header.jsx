import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useCartStore } from "../store/cartStore";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { cart, getCart } = useCartStore();

  const location = useLocation();
  const posPath = location.pathname.includes("/pos");
  const cartPath = location.pathname.includes("/cart");
  const detailProduct = location.pathname.includes("/product/");

  useEffect(() => {
    if (!posPath) return;
    getCart();
  }, [posPath]);

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

      <div className="flex items-center gap-3">
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
        {posPath || cartPath || detailProduct ? (
          <Link to="/cart">
            <button
              className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-soft relative"
              aria-label="Notifikasi"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21C6.53043 21 7.03914 20.7893 7.41421 20.4142C7.78929 20.0391 8 19.5304 8 19C8 18.4696 7.78929 17.9609 7.41421 17.5858C7.03914 17.2107 6.53043 17 6 17C5.46957 17 4.96086 17.2107 4.58579 17.5858C4.21071 17.9609 4 18.4696 4 19ZM15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 17H6V3H4"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5L20 6L19 13H6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-sm font-semibold text-white bg-[var(--c-primary)] rounded-full">
                {cart?.data?.items?.length || 0}
              </span>
            </button>
          </Link>
        ) : null}
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
