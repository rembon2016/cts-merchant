import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";

const BottomSheet = ({ isOpen, onClose, onItemClick, token = null }) => {
  const sheetRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: "soundbox",
      label: "Soundbox",
      url: `${import.meta.env.VITE_BASE_URL_DEV}?user_token=${token}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M11 5 6 9H3v6h3l5 4V5Zm6.5 2.5a5 5 0 0 1 0 9M15 9a3 3 0 0 1 0 6"
          />
        </svg>
      ),
    },
    {
      id: "pos",
      label: "POS",
      url: "/pos",
      // target: "_blank",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
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
      id: "nobank",
      label: "Uang Saku",
      url: "https://nobank.id/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M3 10h18M6 10v8m12-8v8M4 18h16M3 6l9-3 9 3"
          />
        </svg>
      ),
    },
    {
      id: "invoice",
      label: "Invoice",
      url: "/invoice",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M9 14h6M9 10h6M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
          />
        </svg>
      ),
    },
    {
      id: "cs",
      label: "CS",
      url: "/customer-support",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M3 11a9 9 0 1 1 18 0v6a3 3 0 0 1-3 3h-2v-6h5M6 20H5a2 2 0 0 1-2-2v-6h5v6H6Z"
          />
        </svg>
      ),
    },
    {
      id: "ppob",
      label: "PPOB",
      url: "/ppob",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.classList.add("open");
        }
      }, 10);
    } else {
      document.body.classList.remove("overflow-hidden");
      if (sheetRef.current) {
        sheetRef.current.classList.remove("open");
      }
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.classList.remove("open");
    }
    setTimeout(() => {
      onClose();
    }, 260);
  };

  const handleItemClick = (item) => {
    if (item.url === "#") {
      toast.info(`Fitur ${item?.label} Segera Hadir`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (item.url === "/pos") {
      navigate(item.url, { replace: true });
      return;
    }

    if (item.url === "/invoice") {
      navigate(item.url, { replace: true });
      return;
    }

    if (item.url === "/customer-support") {
      navigate(item.url, { replace: true });
      return;
    }

    if (item.url === "/ppob") {
      navigate(item.url, { replace: true });
      return;
    }

    if (item.target === "_blank") {
      window.open(item.url, "_blank");
    }

    if (item.target !== "_blank") {
      if (item.id === "soundbox" && user?.business_account !== null) {
        return;
      }
      onItemClick(item.url, item.label);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {/* <button className="fixed inset-0 z-40" onClick={handleClose} /> */}

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-[3.2rem] pointer-events-none z-10">
        <div className="mx-auto max-w-sm w-full mb-4 px-4 pointer-events-auto">
          <div
            ref={sheetRef}
            className="rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4 h-[300px] sheet"
            style={{
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-primary dark:text-slate-300">
                Menu Lainnya
              </h4>
              <button
                onClick={handleClose}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Tutup
              </button>
            </div>

            {/* Grid 3 cols with 3-2-1 layout */}
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item, index) => {
                // Hide the last item if it would be alone in the last row
                if (
                  index === menuItems.length - 1 &&
                  menuItems.length % 3 === 1
                ) {
                  return <div key={item.id} className="placeholder-cell" />;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="sheet-item bg-slate-50 dark:bg-slate-600 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
                  >
                    <span className="size-12 grid place-items-center rounded-xl accent-bg">
                      {item.icon}
                    </span>
                    <span className="text-xs text-center text-primary dark:text-slate-300">
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {/* Add placeholder cells to maintain grid layout */}
              {Array.from({ length: (3 - (menuItems.length % 3)) % 3 }).map(
                (_, index) => (
                  <div
                    key={`placeholder-${menuItems?.length + index}`}
                    className="placeholder-cell"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
