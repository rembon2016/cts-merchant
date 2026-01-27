import { useThemeStore } from "../store/themeStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTransactionStore } from "../store/transactionStore";
import { useEffect, useMemo } from "react";
import LoadingSkeletonList from "../components/customs/loading/LoadingSkeletonList";
import CustomCheckbox from "../components/customs/form/CustomCheckbox";
import DangerButton from "../components/customs/button/DangerButton";
import { FaMoon, FaPhone, FaQuestion, FaSun, FaUser } from "react-icons/fa";

const Profile = () => {
  const { isDark, setTheme } = useThemeStore();
  const { user, logout, isLoading } = useAuthStore();
  const {
    total,
    getListTransactions,
    isLoading: loadTransaction,
  } = useTransactionStore();

  const pathname = globalThis.location.pathname;

  const menuItems = [
    {
      id: "account",
      label: "Informasi Akun",
      path: "/account-information",
      icon: (
        <FaUser />
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
        <FaQuestion />
      ),
    },
    {
      id: "customer-support",
      label: "Customer Support",
      path: "/customer-support",
      icon: (
       <FaPhone />
      ),
    },
  ];

  const userStatus = user?.business_account?.status;

  const renderElements = useMemo(() => {
    if (loadTransaction) {
      return <LoadingSkeletonList items={6} />;
    }

    return (
      <>
        <div className="bg-white dark:bg-slate-700 rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-600 mb-6">
          <div className="flex items-center gap-4">
            {/* <div className="size-16 rounded-full bg-[var(--c-primary)] text-white grid place-items-center text-2xl font-bold">
            {user.avatar}
          </div> */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {user.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tenant:{" "}
                <strong className="text-[var(--c-primary)] dark:text-slate-200">
                  {user.tenant || "-"}
                </strong>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p
                  className={`text-sm text-[var(--c-primary)] dark:text-slate-300 font-medium`}
                >
                  Status Pengguna:{" "}
                  <strong className="text-[var(--c-primary)] dark:text-slate-100">
                    {userStatus || "Belum Ada Status"}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mb-6">
          <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--c-primary)] dark:text-slate-200">
                {total}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Transaksi
              </p>
            </div>
          </div>
          {/* <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--c-primary)] dark:text-slate-200">
                4.8
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rating Merchant
              </p>
            </div>
          </div> */}
        </div>
        <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[var(--c-accent)] grid place-items-center">
                {isDark ? (
                  <FaMoon className="text-gray-600" />
                ) : (
                  <FaSun />
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
            <CustomCheckbox checked={isDark} onChange={setTheme} />
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
          <DangerButton
            isLoading={isLoading}
            handleOnClick={logout}
            title="Keluar"
            disableCondition={isLoading}
          />
        </div>
      </>
    );
  }, [total, loadTransaction, isLoading, getListTransactions, isDark]);

  useEffect(() => {
    if (!pathname.includes("/profile")) return;
    getListTransactions();
  }, [pathname]);

  return (
    <div className="px-4 py-6">
      {/* Stats Cards */}
      {renderElements}
    </div>
  );
};

export default Profile;
