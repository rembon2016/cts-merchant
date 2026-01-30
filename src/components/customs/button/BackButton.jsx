import { memo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { RouteLoadingFallback } from "../../../utils/routeLoading";

/**
 * BackButton Component - Reusable back navigation button
 *
 * @param {Object} props
 * @param {string} props.to - The path to navigate back to (optional, if not provided uses browser back)
 * @param {boolean} props.replace - Whether to replace current history entry (default: true)
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {Function} props.onClick - Custom onClick handler (optional, overrides navigation)
 * @param {string} props.label - Optional text label to show next to icon
 */
const BackButton = memo(function BackButton(props) {
  const { to, replace = true, className = "", onClick, label = "" } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to, { replace });
    } else {
      navigate(-1);
    }
  };

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors ${className}`}
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {label && <span>{label}</span>}
      </button>
    </Suspense>
  );
});

BackButton.propTypes = {
  to: PropTypes.string,
  replace: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
};

export default BackButton;
