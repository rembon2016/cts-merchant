import PropTypes from "prop-types";

ButtonQuantity.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  stocks: PropTypes.number.isRequired,
  style: PropTypes.object,
};

export default function ButtonQuantity(props) {
  const { quantity, setQuantity, stocks, style } = props;

  return (
    <div
      className="flex items-center justify-between  h-full"
      style={{ ...style }}
    >
      <div className="flex items-center my-auto">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke={quantity >= stocks ? "#999fff" : "currentColor"}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
          {quantity}
        </span>
        <button
          onClick={() => {
            setQuantity(Math.min(stocks, quantity + 1));
          }}
          disabled={quantity >= stocks}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke={quantity >= stocks ? "#999fff" : "currentColor"}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
