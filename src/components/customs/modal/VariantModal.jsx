import { useState } from "react";
import { useThemeStore } from "../../../store/themeStore";
import { usePosStore } from "../../../store/posStore";
import { toast } from "react-toastify";
import { useCartStore } from "../../../store/cartStore";

const VariantModal = ({ isOpen, onClose, product, onSelectVariant }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isDark } = useThemeStore();
  const { getProductPrice, getProductStock } = usePosStore();
  const { addToCart, updateCartItem } = useCartStore();

  if (!isOpen || !product) return null;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    // Support both variant and non-variant products
    const variantId = selectedVariant?.id || null;
    const stock = getProductStock(product, variantId);
    if (stock < quantity) {
      toast.warning(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
      return;
    }

    onSelectVariant({
      product,
      variant: selectedVariant || null,
      quantity,
      price: getProductPrice(product, variantId),
      stock,
    });

    // Reset state
    setSelectedVariant(null);
    setQuantity(1);
    onClose();
  };

  const getVariantPrice = (variant) => {
    return getProductPrice(product, variant.id);
  };

  const getVariantStock = (variant) => {
    return getProductStock(product, variant.id);
  };

  // console.log("Product: ", product?.skus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden ${
          isDark ? "dark" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pilih Varian
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {product.image && (
              <img
                src={`${import.meta.env.VITE_API_IMAGE}${product.image}`}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            )}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Variants List */}
        <div className="p-4 max-h-60 overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pilih Varian:
          </h5>
          <div className="space-y-2">
            {product.skus?.map((variant) => {
              const price = getVariantPrice(variant);
              const stock = getVariantStock(variant);
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = stock <= 0;

              // console.log("Variant: ", variant);

              return (
                <div
                  key={variant.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-[var(--c-primary)] bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {variant.variant_name}
                        </span>
                        {isOutOfStock && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Habis
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-[var(--c-primary)]">
                          Rp {price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Stok: {stock}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-3">
                        <div className="w-5 h-5 bg-[var(--c-primary)] rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantity and Actions */}
        {/* {selectedVariant && (
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Jumlah:
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    const maxStock = getVariantStock(selectedVariant);
                    setQuantity(Math.min(maxStock, quantity + 1));
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        )} */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jumlah:
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => {
                  const maxStock = selectedVariant
                    ? getVariantStock(selectedVariant)
                    : getProductStock(product, null);
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
