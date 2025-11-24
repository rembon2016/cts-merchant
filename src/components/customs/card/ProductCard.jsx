import { ShoppingCart } from "lucide-react";
import { forwardRef, useCallback, useRef } from "react";
import { PropTypes } from "prop-types";

const ProductCard = forwardRef((props) => {
  const {
    loading,
    product,
    price,
    stock,
    disabled,
    onClick,
    handleProductClick,
    isLastProduct,
    hasMoreProducts,
    loadMoreProducts,
    selectedSub,
    subCategories,
    showButtonCart = true,
  } = props;

  const observerRef = useRef();

  const imageSrc = product?.image
    ? `${import.meta.env.VITE_API_IMAGE}${product.image}`
    : "/images/image-placeholder.png";

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreProducts) {
          loadMoreProducts({
            category_id: selectedSub
              ? subCategories.find((cat) => cat.name === selectedSub)?.id || ""
              : "",
            per_page: 20,
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMoreProducts, loadMoreProducts, selectedSub, subCategories]
  );

  return (
    <button
      ref={isLastProduct ? lastProductElementRef : null}
      className={`border rounded-lg shadow hover:shadow-lg transition flex flex-col text-start overflow-hidden ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="relative w-full">
        <img
          src={imageSrc}
          alt={product?.name || "Product Image"}
          className="w-full h-[100px] object-cover rounded-t-[10px]"
          onError={(e) => {
            e.target.src = "/images/placeholder.jpg";
          }}
        />
        {disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-[10px]">
            <span className="text-white font-semibold text-sm">HABIS</span>
          </div>
        )}
        {product?.is_variant && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Varian
          </div>
        )}
      </div>
      <div className="p-2 w-full h-full flex flex-col justify-between">
        <div>
          <div className="text-slate-600 dark:text-slate-300">
            <span className="font-bold text-md">{price}</span>
          </div>
          <div className="mt-2 mb-4">
            <div className="font-semibold text-md line-clamp-2 leading-5 mb-1">
              {product?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Stok: {stock}
            </div>
          </div>
          {showButtonCart ? (
            <button
              className={`w-full flex justify-center items-center gap-2 h-10 py-2 rounded-lg transition-colors ${
                disabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[var(--c-primary)] text-white hover:bg-blue-700"
              } text-xs`}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  handleProductClick(product);
                }
              }}
              disabled={disabled}
            >
              <span className="inline-block">
                <ShoppingCart className="w-4 h-4" />
              </span>
              {disabled ? "Habis" : "Tambahkan"}
            </button>
          ) : null}
        </div>
      </div>
    </button>
  );
});

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  price: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  handleProductClick: PropTypes.func,
  loadMoreProducts: PropTypes.func,
  showButtonCart: PropTypes.bool,
  loading: PropTypes.bool,
  isLastProduct: PropTypes.bool,
  hasMoreProducts: PropTypes.bool,
  selectedSub: PropTypes.string,
  subCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default ProductCard;
