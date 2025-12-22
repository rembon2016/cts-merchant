import PropTypes from "prop-types";
import PrimaryButton from "../button/PrimaryButton";
import AccentButton from "../button/AccentButton";

SimpleModal.propTypes = {
  onClose: PropTypes.func,
  handleClick: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  showButton: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const warningIcon = () => {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8427 13.38C13.4955 9.09252 11.148 4.80502 8.80019 0.517524C8.72191 0.369143 8.60462 0.24494 8.46096 0.158302C8.31729 0.0716651 8.15271 0.0258789 7.98494 0.0258789C7.81718 0.0258789 7.6526 0.0716651 7.50893 0.158302C7.36527 0.24494 7.24798 0.369143 7.16969 0.517524C4.82244 4.80502 2.47319 9.09252 0.127194 13.38C-0.236056 14.0423 0.226944 14.9008 0.941694 14.9008H15.0292C15.4252 14.9008 15.6912 14.6875 15.8299 14.3983C16.0044 14.1228 16.0512 13.757 15.8437 13.3795"
        fill="#FFDD15"
      />
      <path
        d="M7.22906 8.6191L7.00681 5.3036C6.96565 4.65776 6.94515 4.19401 6.94531 3.91235C6.94531 3.52885 7.04531 3.2306 7.24581 3.01535C7.44698 2.80118 7.71156 2.69401 8.03956 2.69385C8.43531 2.69385 8.70106 2.8316 8.83406 3.10535C8.96856 3.38068 9.03598 3.7766 9.03631 4.2931C9.03631 4.5971 9.01981 4.9061 8.98681 5.2201L8.68931 8.63235C8.65715 9.03885 8.58823 9.35043 8.48256 9.5671C8.37606 9.78485 8.20056 9.89235 7.95531 9.89235C7.70731 9.89235 7.53281 9.7876 7.43731 9.5781C7.33906 9.36785 7.27031 9.0481 7.22906 8.6191ZM7.99706 13.1733C7.7159 13.1737 7.47031 13.0826 7.26031 12.9001C7.05031 12.7179 6.94531 12.4631 6.94531 12.1356C6.94531 11.8498 7.04531 11.6056 7.24581 11.4053C7.44706 11.2038 7.69231 11.1038 7.98356 11.1038C8.27481 11.1038 8.52181 11.2038 8.72781 11.4053C8.93156 11.6056 9.03631 11.8498 9.03631 12.1356C9.03631 12.4581 8.93156 12.7126 8.72481 12.8966C8.52599 13.0776 8.26593 13.1765 7.99706 13.1733Z"
        fill="#1F2E35"
      />
    </svg>
  );
};

export default function SimpleModal({
  onClose,
  handleClick,
  title,
  content,
  showButton = false,
  isLoading = false,
}) {
  const handleClose = () => onClose();

  // Handle click outside to close
  const handleOutsideClick = (e) => {
    if (e.target.id === "promo-detail-modal-backdrop") {
      handleClose();
    }
  };

  return (
    <button
      id="promo-detail-modal-backdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative p-4">
        <div className="flex justify-between items-center w-full mb-5">
          <h3 className="text-start">{title}</h3>
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
        </div>
        <div className="flex flex-col gap-1 justify-center items-center">
          {warningIcon()}
          <h3 className="text-xl font-bold mt-3 text-center">{content}</h3>
        </div>
        {showButton && (
          <div className="mt-4 flex justify-end gap-2 w-full">
            <AccentButton
              title="Batal"
              // isLoading={isLoading}
              handleOnClick={onClose}
              disableCondition={isLoading}
            />
            <PrimaryButton
              title="Hapus"
              isLoading={isLoading}
              handleOnClick={handleClick}
              disableCondition={isLoading}
            />
          </div>
        )}
      </div>
    </button>
  );
}
