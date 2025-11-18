import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

SecondaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleOnClick: PropTypes.func,
};

export default function SecondaryButton(props) {
  const { title, isLoading, disableCondition, handleOnClick } = props;

  return (
    <button
      onClick={handleOnClick}
      className="bg-gray-500 text-white rounded-lg py-4 px-6 font-semibold flex-1 hover:bg-gray-600 transition-colors ease-linear duration-300"
      disabled={disableCondition}
    >
      {isLoading ? <LoadingSpinner /> : title}
    </button>
  );
}
