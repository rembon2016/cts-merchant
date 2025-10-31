import { useNavigate } from "react-router-dom";

/**
 * BackButton Component - Reusable back navigation button
 * 
 * @param {Object} props
 * @param {string} props.to - The path to navigate back to (required)
 * @param {boolean} props.replace - Whether to replace current history entry (default: true)
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {Function} props.onClick - Custom onClick handler (optional, overrides navigation)
 * @param {string} props.label - Optional text label to show next to icon
 */
export default function BackButton({ 
  to, 
  replace = true, 
  className = "", 
  onClick,
  label = ""
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to, { replace });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 mb-4 text-gray-700 hover:text-blue-600 transition-colors ${className}`}
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
  );
}
