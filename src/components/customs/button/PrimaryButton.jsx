import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
  showIcon: PropTypes.bool,
  icon: PropTypes.node,
};

export default function PrimaryButton(props) {
  const {
    title,
    isLoading,
    disableCondition,
    handleOnClick,
    showIcon = false,
    icon = null,
  } = props;

  return (
    <button
      type="submit"
      className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      onClick={handleOnClick}
      disabled={disableCondition}
    >
      {" "}
      {showIcon && !isLoading && icon}
      {isLoading ? <LoadingSpinner /> : title}
    </button>
  );
}
