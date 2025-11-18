import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
};

export default function PrimaryButton(props) {
  const { title, isLoading, disableCondition, handleOnClick } = props;

  return (
    <button
      type="submit"
      className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      onClick={handleOnClick}
      disabled={disableCondition}
    >
      {isLoading ? <LoadingSpinner /> : title}
    </button>
  );
}
