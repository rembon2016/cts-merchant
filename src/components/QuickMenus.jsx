import { useEffect, useState } from "react";
import IframeModal from "./IframeModal";
import BottomSheet from "./BottomSheet";
import { useNavigate } from "react-router-dom";
import { useGenerateToken } from "../store/tokenStore";
import { useAuthStore } from "../store/authStore";

const QuickMenus = () => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    url: "",
    title: "",
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  const { token, generateToken } = useGenerateToken();
  const { user } = useAuthStore();

  useEffect(() => {
    generateToken();
  }, [token, modalData]);

  const menuItems = [
    {
      id: "soundbox",
      label: "Soundbox",
      url: `${import.meta.env.VITE_BASE_URL_DEV}?user_token=${token}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6"
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
  ];

  const handleMenuClick = (item) => {
    // return;

    if (item.url === "/pos") {
      navigate(item.url, { replace: true });
    }

    if (item?.target !== "_blank") {
      if (item?.id === "soundbox" && user?.business_account === null) {
        setModalData({ isOpen: true, url: item.url, title: item.label });
      } else if (item?.id === "soundbox" && user?.business_account !== null) {
        setModalData({ isOpen: false, url: item.url, title: item.label });
      } else if (item?.id !== "soundbox") {
        setModalData({ isOpen: true, url: item.url, title: item.label });
      }
    } else {
      window.open(item.url, "_blank");
    }
  };

  const closeModal = () => {
    setModalData({ isOpen: false, url: "", title: "" });
  };

  return (
    <>
      <section className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className="bg-white dark:bg-slate-700 rounded-2xl p-2 flex flex-col items-center gap-2 shadow-soft"
            >
              <span className="grid place-items-center size-12 rounded-xl accent-bg">
                {item.icon}
              </span>
              <span className="text-xs font-medium text-primary dark:text-slate-300">
                {item.label}
              </span>
            </button>
          ))}

          <button
            onClick={() => setIsSheetOpen(true)}
            className="bg-white dark:bg-slate-700 rounded-2xl p-2 flex flex-col items-center gap-2 shadow-soft"
          >
            <span className="grid place-items-center size-12 rounded-xl bg-[var(--c-accent)] text-slate-600 dark:text-slate-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 6.99998C2.36739 6.99998 2.24021 6.9473 2.14645 6.85353C2.05268 6.75976 2 6.63258 2 6.49998V2.50098C2 2.36837 2.05268 2.24119 2.14645 2.14742C2.24021 2.05366 2.36739 2.00098 2.5 2.00098H6.5C6.63261 2.00098 6.75979 2.05366 6.85355 2.14742C6.94732 2.24119 7 2.36837 7 2.50098V6.49998C7 6.63258 6.94732 6.75976 6.85355 6.85353C6.75979 6.9473 6.63261 6.99998 6.5 6.99998H2.5ZM9.5 6.99998C9.36739 6.99998 9.24021 6.9473 9.14645 6.85353C9.05268 6.75976 9 6.63258 9 6.49998V2.50098C9 2.36837 9.05268 2.24119 9.14645 2.14742C9.24021 2.05366 9.36739 2.00098 9.5 2.00098H13.499C13.6316 2.00098 13.7588 2.05366 13.8526 2.14742C13.9463 2.24119 13.999 2.36837 13.999 2.50098V6.49998C13.999 6.63258 13.9463 6.75976 13.8526 6.85353C13.7588 6.9473 13.6316 6.99998 13.499 6.99998H9.5ZM2.5 14C2.36739 14 2.24021 13.9473 2.14645 13.8535C2.05268 13.7598 2 13.6326 2 13.5V9.49998C2 9.36737 2.05268 9.24019 2.14645 9.14642C2.24021 9.05265 2.36739 8.99998 2.5 8.99998H6.5C6.63261 8.99998 6.75979 9.05265 6.85355 9.14642C6.94732 9.24019 7 9.36737 7 9.49998V13.5C7 13.6326 6.94732 13.7598 6.85355 13.8535C6.75979 13.9473 6.63261 14 6.5 14H2.5ZM9.5 14C9.36739 14 9.24021 13.9473 9.14645 13.8535C9.05268 13.7598 9 13.6326 9 13.5V9.49998C9 9.36737 9.05268 9.24019 9.14645 9.14642C9.24021 9.05265 9.36739 8.99998 9.5 8.99998H13.499C13.6316 8.99998 13.7588 9.05265 13.8526 9.14642C13.9463 9.24019 13.999 9.36737 13.999 9.49998V13.5C13.999 13.6326 13.9463 13.7598 13.8526 13.8535C13.7588 13.9473 13.6316 14 13.499 14H9.5Z"
                  fill="black"
                />
              </svg>
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Lainnya
            </span>
          </button>
        </div>
      </section>

      <IframeModal
        isOpen={modalData.isOpen}
        url={modalData.url}
        title={modalData.title}
        onClose={closeModal}
      />

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onItemClick={(url, title) => {
          setIsSheetOpen(false);
          setTimeout(() => {
            setModalData({ isOpen: true, url, title });
          }, 320);
        }}
        token={token}
      />
    </>
  );
};

export default QuickMenus;
