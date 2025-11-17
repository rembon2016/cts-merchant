import PropTypes from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disableCondition: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default function PrimaryButton(props) {
  const { title, isLoading, disableCondition, handleSubmit } = props;

  return (
    <button
      type="submit"
      className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition"
      onClick={handleSubmit}
      disabled={disableCondition}
    >
      {isLoading ? <LoadingSpinner /> : title}
    </button>
  );
}
