import { ShoppingCart } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import SimpleModal from "../modal/SimpleModal";
import { useProductStore } from "../../../store/productStore";
import LoadingSkeletonCard from "../loading/LoadingSkeletonCard";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../toast/CustomToast";
import { usePosStore } from "../../../store/posStore";
import CustomImage from "../element/CustomImage";

const ProductCard = forwardRef((props) => {
  const {
    product,
    price,
    stock,
    onClick,
    loading,
    disabled,
    handleProductClick,
    showButtonCart = true,
    showButtonDelete = false,
  } = props;

  const { removeProducts } = useProductStore();
  const { getProducts } = usePosStore();

  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const [showModal, setShowModal] = useState(false);
  const [pendingItemId, setPendingItemId] = useState(null);

  const handleOpenModal = (e, itemId) => {
    e.stopPropagation();
    setShowModal(true);
    setPendingItemId(itemId);
  };

  const handleCloseModal = () => setShowModal(false);

  const observerRef = useRef();

  const imageSrc = product?.image
    ? `${import.meta.env.VITE_API_IMAGE}${product.image}`
    : "/images/image-placeholder.png";

  const handleConfirmDelete = async () => {
    // Close modal immediately to prevent reappearing due to store updates
    setShowModal(false);
    setPendingItemId(null);

    // Proceed with deletion
    const response = await removeProducts(pendingItemId);
    if (response?.success === true) {
      setShowModal(false);
      showSuccess("Berhasil Menghapus Produk");
      getProducts(); // Refresh product list after deletion
    } else {
      showError("Gagal Menghapus Produk");
      setShowModal(false);
    }
  };

  const deleteIcon = useMemo(() => {
    return (
      <svg
        width="16"
        height="17"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-end"
      >
        <path
          d="M14 11.5V17.5M10 11.5V17.5M6 7.5V19.5C6 20.0304 6.21071 20.5391 6.58579 20.9142C6.96086 21.2893 7.46957 21.5 8 21.5H16C16.5304 21.5 17.0391 21.2893 17.4142 20.9142C17.7893 20.5391 18 20.0304 18 19.5V7.5M4 7.5H20M7 7.5L9 3.5H15L17 7.5"
          stroke="#EC3838"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }, []);

  const renderElementsCard = useMemo(() => {
    if (loading) {
      return <LoadingSkeletonCard items={product?.length} />;
    }

    return (
      <div className="relative w-full">
        {showButtonDelete && (
          <button
            className="absolute top-1.5 left-2 bg-white rounded-full p-1 hover:bg-red-100 z-20 shadow-lg"
            onClick={(e) => handleOpenModal(e, product?.id)}
          >
            {deleteIcon}
          </button>
        )}
        <button
          ref={observerRef}
          className={`border dark:border-none dark:bg-slate-700 rounded-lg shadow hover:shadow-lg transition flex flex-col text-start overflow-hidden w-full ${
            disabled ? "opacity-50" : "cursor-pointer"
          }`}
          onClick={onClick}
          disabled={disabled}
        >
          <div className="relative w-full">
            <CustomImage
              imageSource={imageSrc}
              imageWidth={400}
              imageHeight={200}
              altImage={product?.name || "Product Image"}
              placeholderUrl="/images/blur-placeholder.jpg"
              imageLoad="eager" // Ubah ke lazy untuk performa
              className="rounded-t-[10px] h-[120px] object-cover"
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
                  {product?.name?.slice(0, 12) +
                    (product?.name?.length > 12 ? "..." : "")}
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
      </div>
    );
  }, [
    showButtonCart,
    disabled,
    product,
    price,
    stock,
    handleProductClick,
    deleteIcon,
    onClick,
    imageSrc,
    handleOpenModal,
    handleCloseModal,
    loading,
  ]);

  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    };

    preloadImage(imageSrc);
  }, [imageSrc]);

  return (
    <>
      {showModal && (
        <SimpleModal
          onClose={handleCloseModal}
          handleClick={handleConfirmDelete}
          title="Hapus Data"
          content={"Hapus produk ini dari daftar?"}
          showButton={true}
        />
      )}
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      {renderElementsCard}
    </>
  );
});

ProductCard.displayName = "ProductCard";

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  price: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  handleProductClick: PropTypes.func,
  showButtonCart: PropTypes.bool,
  showButtonDelete: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ProductCard;
