import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";
import { ElementsNoData } from "../element/NoData";

const BottomSheet = ({
  title = "Menu Lainnya",
  isOpen,
  onClose,
  onItemClick,
  isMenuItems = true,
  data = null,
  setSelectedSub = null,
}) => {
  const sheetRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

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
    if (!isMenuItems) setSelectedSub(item?.id);

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

  const renderElements = useMemo(() => {
    if (data?.length === 0) return;

    return (
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
                {title}
              </h4>
              <button
                onClick={handleClose}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Tutup
              </button>
            </div>

            {data?.length === 0 && <ElementsNoData text="Tidak ada kategori" />}

            {/* Grid 3 cols with 3-2-1 layout */}
            <div className="grid grid-cols-3 gap-3">
              {data?.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="sheet-item bg-slate-50 dark:bg-slate-600 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
                  >
                    {isMenuItems ? (
                      <span className="size-12 grid place-items-center rounded-xl accent-bg">
                        {item?.icon}
                      </span>
                    ) : (
                      <img
                        src={
                          item.image
                            ? `${import.meta.env.VITE_API_IMAGE}${item.image}`
                            : "/images/image-placeholder.png"
                        }
                        alt={item.name || "Product Image"}
                        className="w-full h-[60px] object-cover"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    )}
                    <span className="text-xs text-center text-primary dark:text-slate-300">
                      {item?.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }, [data, isMenuItems, sheetRef, handleClose, handleItemClick]);

  // console.log(data);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {/* <button className="fixed inset-0 z-40" onClick={handleClose} /> */}

      {/* Bottom Sheet */}
      {renderElements}
    </>
  );
};

export default BottomSheet;
