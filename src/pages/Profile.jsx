import { useUserStore } from "../store/userStore";
import { useThemeStore } from "../store/themeStore";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useUserStore();
  const { isDark, toggleTheme } = useThemeStore();

  const menuItems = [
    {
      id: "account",
      label: "Informasi Akun",
      path: "/account-information",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    // {
    //   id: "security",
    //   label: "Keamanan",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   id: "notifications",
    //   label: "Notifikasi",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    //       />
    //     </svg>
    //   ),
    // },
    {
      id: "help",
      label: "Bantuan",
      path: "/faq",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const handleMenuClick = (menuId) => {
    switch (menuId) {
      case "security":
        alert("Fitur Keamanan segera hadir");
        break;
      case "notifications":
        alert("Fitur Notifikasi segera hadir");
        break;
      case "help":
        alert("Fitur Bantuan segera hadir");
        break;
      default:
        break;
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-700 rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-600 mb-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-[var(--c-primary)] text-white grid place-items-center text-2xl font-bold">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {user.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Merchant Premium
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--c-primary)] dark:text-slate-200">
              156
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Transaksi
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--c-primary)] dark:text-slate-200">
              4.8
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Rating Merchant
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[var(--c-accent)] grid place-items-center">
              {isDark ? (
                <svg
                  className="w-5 h-5 text-slate-700 dark:text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-slate-700 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium dark:text-slate-100 text-slatte-600">
                {isDark ? "Mode Gelap" : "Mode Terang"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ubah tampilan aplikasi
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? "bg-[var(--c-accent)]" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.id}>
            <button
              key={item.id}
              // onClick={() => handleMenuClick(item.id)}
              className="w-full bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[var(--c-accent)] grid place-items-center text-slate-700 dark:text-slate-600">
                    {item.icon}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {item.label}
                  </span>
                </div>
              </div>
            </button>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <Link to="/login">
          <button className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl p-4 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            Keluar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
