import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";
import { memo, Suspense } from "react";
import { RouteLoadingFallback } from "../../../utils/routeLoading";

const DangerButton = memo(function DangerButton(props) {
  const {
    title,
    isLoading,
    disableCondition,
    handleOnClick,
    showIcon = false,
    icon = null,
  } = props;

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <button
        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl p-4 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
        onClick={handleOnClick}
        disabled={disableCondition}
      >
        {showIcon && !isLoading && icon}
        {isLoading ? <LoadingSpinner spinColor="red-600" /> : title}
      </button>
    </Suspense>
  );
});

DangerButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
  showIcon: PropTypes.bool,
  icon: PropTypes.node,
};

export default DangerButton;
