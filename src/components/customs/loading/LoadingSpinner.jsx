import PropTypes from "prop-types";

LoadingSpinner.propTypes = {
  spinColor: PropTypes.string,
};

export default function LoadingSpinner({ spinColor = "white" }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`w-5 h-5 border-2 border-${spinColor} border-t-transparent rounded-full animate-spin`}
      />
      Tunggu...
    </div>
  );
}
