import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

DangerButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
};

export default function DangerButton(props) {
  const { title, isLoading, disableCondition, handleOnClick } = props;

  return (
    <button
      className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl p-4 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      onClick={handleOnClick}
      disabled={disableCondition}
    >
      {isLoading ? <LoadingSpinner spinColor="red-600" /> : title}
    </button>
  );
}
