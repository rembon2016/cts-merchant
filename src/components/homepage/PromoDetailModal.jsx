import { useMemo, memo, useCallback } from "react";
import PropTypes from "prop-types";

const PromoDetailModal = memo(function PromoDetailModal({
  promoId,
  onClose,
  promoData,
}) {
  const promoDetail = useMemo(() => {
    if (!promoId || !promoData) return null;
    return promoData.find((item) => item.id === promoId);
  }, [promoId, promoData]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  // Handle click outside to close
  const handleOutsideClick = useCallback(
    (e) => {
      if (e.target.id === "promo-detail-modal-backdrop") {
        handleClose();
      }
    },
    [handleClose],
  );

  if (!promoId) return null;

  return (
    <div
      id="promo-detail-modal-backdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          {promoDetail ? (
            <>
              <img
                src={promoDetail.thumbnail}
                alt={promoDetail.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                loading="lazy"
                width="416"
                height="192"
                decoding="async"
              />
              <h2 className="text-2xl font-bold mb-2 text-primary dark:text-white">
                {promoDetail.title}
              </h2>
              <div
                className="text-slate-700 dark:text-slate-300 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: promoDetail.description,
                }}
              />
            </>
          ) : (
            <p>Detail promo tidak ditemukan.</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 bg-gray-200 rounded-full p-1 hover:text-gray-900 dark:text-gray-300 dark:bg-slate-700 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

PromoDetailModal.propTypes = {
  promoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
  promoData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

export default PromoDetailModal;
