import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

AccentButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
};

export default function AccentButton(props) {
  const { title, isLoading, disableCondition, handleOnClick } = props;

  return (
    <button
      type="submit"
      className="w-full py-4 bg-[var(--c-accent)] text-gray-700 font-semibold rounded-lg hover:bg-yellow-400 transition"
      onClick={handleOnClick}
      disabled={disableCondition}
    >
      {isLoading ? <LoadingSpinner /> : title}
    </button>
  );
}
