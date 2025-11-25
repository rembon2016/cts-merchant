import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

BottomSheet.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onItemClick: PropTypes.func,
  isMenuItems: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.object),
  renderContent: PropTypes.node,
};

export default function BottomSheet({
  title = "Menu Lainnya",
  isOpen,
  onClose,
  isMenuItems = true,
  data = null,
  renderContent = null,
}) {
  const sheetRef = useRef(null);

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

  const renderElements = useMemo(() => {
    if (data?.length === 0) return;

    return (
      <div className="fixed inset-x-0 bottom-[3.2rem] pointer-events-none z-10">
        <div className="mx-auto max-w-sm w-full mb-4 px-4 pointer-events-auto">
          <div
            ref={sheetRef}
            className="rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4 max-h-[400px] h-full mb-10 sheet overflow-y-auto no-scrollbar"
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

            {renderContent}
          </div>
        </div>
      </div>
    );
  }, [data, isMenuItems, sheetRef, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {/* <button className="fixed inset-0 z-40" onClick={handleClose} /> */}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Bottom Sheet */}
      {renderElements}
    </>
  );
}
