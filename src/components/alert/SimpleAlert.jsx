import { AlertCircle } from "lucide-react";
import PropTypes from "prop-types";

SimpleAlert.propTypes = {
  type: PropTypes.string,
  textContent: PropTypes.string,
};

export default function SimpleAlert({ type, textContent }) {
  const baseClassAlert = "mb-6 p-4 rounded-lg flex items-center gap-3";
  const baseClassIcon = "w-5 h-5 flex-shrink-0";

  const getColorAlert = (type) => {
    switch (type) {
      case "error":
        return "bg-red-50 dark:bg-red-600/50 border border-red-200 dark:border-red-500";
      case "success":
        return "bg-green-50 dark:bg-green-600/50 border border-green-200 dark:border-green-500";
      default:
        return "bg-red-50 dark:bg-red-600/50 border border-red-200 dark:border-red-500";
    }
  };

  const getColorIcon = (type) => {
    switch (type) {
      case "error":
        return "text-red-500 dark:text-red-200";
      case "success":
        return "text-green-500 dark:text-green-200";
      default:
        return "text-red-500 dark:text-red-200";
    }
  };

  const getColorText = (type) => {
    switch (type) {
      case "error":
        return "text-red-700 dark:text-red-100";
      case "success":
        return "text-green-700 dark:text-green-100";
      default:
        return "text-red-700 dark:text-red-100";
    }
  };

  if (type === null) return;

  return (
    <div className={`${baseClassAlert} ${getColorAlert(type)}`}>
      <AlertCircle className={`${baseClassIcon} ${getColorIcon(type)}`} />
      <span className={`${getColorText(type)} text-sm`}>{textContent}</span>
    </div>
  );
}
