import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";
import { memo, Suspense } from "react";
import { RouteLoadingFallback } from "../../../utils/routeLoading";

const SecondaryButton = memo(function SecondaryButton(props) {
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
        onClick={handleOnClick}
        className="bg-gray-500 text-white rounded-lg py-4 px-6 font-semibold flex-1 hover:bg-gray-600 transition-colors ease-linear duration-300 flex items-center justify-center gap-2"
        disabled={disableCondition}
      >
        {showIcon && !isLoading && icon}
        {isLoading ? <LoadingSpinner /> : title}
      </button>
    </Suspense>
  );
});

SecondaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
  showIcon: PropTypes.bool,
  icon: PropTypes.node,
};

export default SecondaryButton;
