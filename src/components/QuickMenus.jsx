import { useState } from "react";
import IframeModal from "./IframeModal";
import BottomSheet from "./BottomSheet";
import { useNavigate } from "react-router-dom";

const QuickMenus = () => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    url: "",
    title: "",
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "soundbox",
      label: "Soundbox",
      url: "http://src.ctsolution.id/",
      target: "_blank",
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
      target: "_blank",
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

    if (item.target === "_blank") {
      window.open(item.url, "_blank");
    } else {
      setModalData({ isOpen: true, url: item.url, title: item.label });
    }
  };

  const closeModal = () => {
    setModalData({ isOpen: false, url: "", title: "" });
  };

  return (
    <>
      <section className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className="bg-white dark:bg-slate-700 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-soft"
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
            className="bg-white dark:bg-slate-700 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-soft"
          >
            <span className="grid place-items-center size-12 rounded-xl bg-[var(--c-accent)] text-slate-600 dark:text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M12 5v.01M12 12v.01M12 19v.01"
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
      />
    </>
  );
};

export default QuickMenus;
