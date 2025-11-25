import { PropTypes } from "prop-types";
import LoadingSpinner from "../loading/LoadingSpinner";

LoadMoreButton.propTypes = {
  data: PropTypes.array.isRequired,
  totalData: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
};

export default function LoadMoreButton(props) {
  const { data, totalData, loading, handleLoadMore } = props;
  return (
    <>
      {data?.length < totalData && (
        <div className="mt-6 text-center">
          <button
            disabled={loading}
            onClick={handleLoadMore}
            className="p-3 min-w-[200px] rounded-2xl bg-white hover:text-slate-200 dark:bg-slate-700 text-[var(--c-primary)] dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600 hover:bg-[var(--c-primary)] dark:hover:bg-slate-600 transition-colors"
          >
            {loading ? <LoadingSpinner /> : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </>
  );
}
