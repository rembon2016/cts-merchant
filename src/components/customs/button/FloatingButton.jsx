import PropTypes from "prop-types";
import { memo, Suspense } from "react";
import { RouteLoadingFallback } from "../../../utils/routeLoading";

const FloatingButton = memo(function FloatingButton(props) {
  const { title, buttonClassName, handleOnClick, isLoading } = props;
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <div
        className="fixed"
        style={{
          bottom: "4.8rem",
          // right: "max(0px, calc((100vw - 24rem)/2 + 1rem))",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleOnClick}
          className={`text-2xl w-16 h-16 bg-[var(--c-primary)] text-white rounded-full font-semibold hover:bg-blue-700  flex items-center justify-center shadow-xl shadow-blue-300/20 hover:shadow-none transition-all dark:bg-blue-600 dark:hover:bg-blue-700 duration-500 ease-in-out ${buttonClassName}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            title || "+"
          )}
        </button>
      </div>
    </Suspense>
  );
});

FloatingButton.propTypes = {
  title: PropTypes.string,
  buttonClassName: PropTypes.string,
  handleOnClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default FloatingButton;
