import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTotalPriceStore } from "../store/totalPriceStore";
import { useCartStore } from "../store/cartStore";
import { useCheckoutStore } from "../store/checkoutStore";

const BottomNav = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { totalPrice, setTotalPrice } = useTotalPriceStore();
  const { savePendingOrder } = useCheckoutStore();
  const { selectedCart } = useCartStore();
  const navigation = useNavigate();
  const pathname = location.pathname;
  const getCart = sessionStorage.getItem("cart");

  const processData = {
    branch_id: sessionStorage.getItem("branchActive") || 0,
    user_id: sessionStorage.getItem("userId") || 0,
    sub_total: 0,
    customer_id: 0,
    discount_id: 0,
    tax_amount: 0,
    discount_amount: 0,
    items: [
      {
        product_id: 0,
        product_sku_id: 0,
        quantity: 1,
        price: 0,
        notes: "",
      },
    ],
  };

  const showButtonFromPath = ["/cart", "/checkout", "/payment"];

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

  const ObjectTitle = [
    {
      path: "/cart",
      title: "Pesan Sekarang",
    },
    {
      path: "/checkout",
      title: "Lanjut ke Pembayaran",
    },
    {
      path: "/payment",
      title: "Bayar Sekarang",
    },
  ];

  let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const handleAddTax = () => {
    setTotalPrice(totalPrice + (totalPrice * 11) / 100);
  };

  const handleSubmit = () => {
    setLoading(true);
    sessionStorage.setItem("cart", JSON.stringify(selectedCart));

    if (pathname === "/payment") {
      proccessOrder();
      return;
    }

    setTimeout(() => {
      navigation(pathname === "/cart" ? "/checkout" : "/payment", {
        replace: true,
      });
      setLoading(false);
    }, 1000);
  };

  const proccessOrder = async () => await savePendingOrder(processData);

  const renderElements = useMemo(() => {
    const renderElementCart = () => {
      return (
        <div
          className={`rounded-3xl bg-white dark:bg-slate-700 shadow-soft border border-slate-100 dark:border-slate-600 ${
            showButtonFromPath.includes(location.pathname)
              ? "p-2 mx-4 mb-2"
              : ""
          }`}
        >
          <div className="flex flex-col gap-2">
            {/* <div className="flex justify-between items-center">
              <h3 className="font-medium text-xl">Sub Total</h3>
              <h3 className="font-bold text-xl">{Rupiah.format(totalPrice)}</h3>
            </div> */}
            {/* <div className="flex justify-between items-center">
              <h3 className="font-medium text-xl">Pajak (+11%)</h3>
              <h3 className="font-bold text-xl">Rp. 6.000</h3>
            </div> */}
            {location.pathname === "/cart" && (
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-xl">Total</h3>
                <div className="flex gap-2">
                  {totalPrice !== 0 && (
                    <button
                      className="text-sm font-semibold text-[var(--c-primary)]"
                      onClick={handleAddTax}
                    >
                      + Pajak
                    </button>
                  )}
                  <h3 className="font-bold text-xl">
                    {Rupiah.format(totalPrice)}
                  </h3>
                </div>
              </div>
            )}
          </div>
          {showButtonFromPath.includes(location.pathname) && (
            <button
              type="submit"
              className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition mt-4"
              onClick={handleSubmit}
              disabled={selectedCart?.length === 0 || loading}
            >
              {loading
                ? "Memproses..."
                : ObjectTitle.find((item) => item.path === location.pathname)
                    .title}
            </button>
          )}
        </div>
      );
    };

    return (
      <div className="max-w-sm mx-auto">
        {renderElementCart()}
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
    );
  }, [navItems, totalPrice, location.pathname]);

  return <nav className="fixed bottom-0 inset-x-0">{renderElements}</nav>;
};

export default BottomNav;
