import PropTypes from "prop-types";

SimpleModal.propTypes = {
  onClose: PropTypes.func,
  handleClick: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  showButton: PropTypes.bool,
};

export default function SimpleModal({
  onClose,
  handleClick,
  title,
  content,
  showButton = false,
}) {
  const handleClose = () => onClose();

  // Handle click outside to close
  const handleOutsideClick = (e) => {
    if (e.target.id === "promo-detail-modal-backdrop") {
      handleClose();
    }
  };

  return (
    <div
      id="promo-detail-modal-backdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative p-4">
        <h3>{title}</h3>
        <h1 className="text-2xl font-bold mt-3">{content}</h1>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 bg-gray-200 rounded-full p-1 hover:text-gray-900 dark:text-gray-300 dark:bg-slate-700 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
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
        {showButton && (
          <div className="mt-4 flex justify-end gap-2 w-full">
            <button
              type="submit"
              className="p-4 bg-[var(--c-accent)] text-gray-700 font-semibold rounded-xl hover:bg-yellow-300 transition mt-4"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="p-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition mt-4"
              onClick={handleClick}
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
