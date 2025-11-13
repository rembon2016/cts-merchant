export default function PopupBox({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-md",
  showCloseButton = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        role="presentation"
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
        tabIndex={0}
      />

      {/* Popup Content */}
      <div
        className={`relative ${width} w-full bg-white rounded-lg shadow-xl transform transition-all`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
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
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
