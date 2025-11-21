import { useEffect, useMemo, useState } from "react";
import IframeModal from "../modal/IframeModal";
import BottomSheet from "../menu/BottomSheet";
import { useNavigate } from "react-router-dom";
import { useGenerateToken } from "../../../store/tokenStore";
import { useAuthStore } from "../../../store/authStore";
import { listMenuItems } from "../../../utills/ListMenuItems.jsx";

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

  const menuItems = listMenuItems(token);

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
      setModalData({ isOpen: true, url: item.url, title: item.label });
    }
  };

  const closeModal = () => setModalData({ isOpen: false, url: "", title: "" });

  const renderElements = useMemo(() => {
    return (
      <div className="grid grid-cols-3 gap-3">
        {menuItems?.map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="sheet-item bg-slate-50 dark:bg-slate-600 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
            >
              <span className="size-12 grid place-items-center rounded-xl accent-bg">
                {item?.icon}
              </span>
              <span className="text-xs text-center text-primary dark:text-slate-300">
                {item?.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [menuItems]);

  return (
    <>
      <section className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {menuItems?.slice(0, 3)?.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className="bg-white dark:bg-slate-700 rounded-2xl p-2 flex flex-col items-center gap-2 shadow-soft"
            >
              <span className="grid place-items-center size-12 rounded-xl accent-bg">
                {item.icon}
              </span>
              <span className="text-xs font-medium text-primary dark:text-slate-300">
                {item.name}
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
        renderContent={renderElements}
        token={token}
      />
    </>
  );
};

export default QuickMenus;
