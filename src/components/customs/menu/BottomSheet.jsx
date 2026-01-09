import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import useResizableModalBox from "../../../hooks/useResizableModalBox";

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
  bodyHeight = "300px",
}) {
  const sheetRef = useRef(null);

  // Resizable modal logic moved to hook
  const { sheetStyle, handleMouseDown, handleTouchStart } =
    useResizableModalBox({ isOpen, bodyHeight, onClose, sheetRef });

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
      <div className="fixed inset-0 z-[9999]">
        <button
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-label="Close bottom sheet"
        />
        <button
          className="absolute bottom-0 left-0 right-0 mx-auto max-w-sm w-full px-4 pointer-events-auto"
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown(e);
          }}
          onTouchStart={(e) => {
            handleTouchStart(e);
          }}
        >
          <div
            ref={sheetRef}
            className="rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4 max-h-[95vh] sheet overflow-y-auto no-scrollbar"
            style={{
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
              ...sheetStyle,
            }}
          >
            <div className="flex items-center justify-center">
              <button className="flex flex-col items-center justify-between mb-3">
                <button className="flex items-center justify-center mb-3 cursor-grab">
                  <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-slate-500" />
                </button>
                <h4 className="font-semibold text-primary dark:text-slate-300">
                  {title}
                </h4>
              </button>
            </div>
            {renderContent}
          </div>
        </button>
      </div>
    );
  }, [data, isMenuItems, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Bottom Sheet */}
      {renderElements}
    </>
  );
}
