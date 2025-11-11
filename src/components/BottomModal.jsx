import { useEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { formatCurrency } from "../helper/currency";
import { useCartStore } from "../store/cartStore";
import { usePosStore } from "../store/posStore";
import { useCustomToast } from "../hooks/useCustomToast";
import CustomToast from "./CustomToast";
import SimpleInput from "./form/SimpleInput";
import ButtonQuantity from "./ButtonQuantity";
import PropTypes from "prop-types";
import { ShoppingCart } from "lucide-react";

BottomModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  onClose: PropTypes.func,
  stocks: PropTypes.number,
  data: PropTypes.object,
  isFromDetail: PropTypes.bool,
};

export default function BottomModal(props) {
  const { isOpen, setIsOpen, onClose, stocks, data, isFromDetail } = props;

  const sheetRef = useRef(null);
  const { isDark } = useThemeStore();
  const { getProductPrice, getProductStock } = usePosStore();
  const { addToCart, getCart, updateCartItem, success, isLoading } =
    useCartStore();
  const { toast, success: showSuccess, error: showError, hideToast } = useCustomToast();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [formData, setFormData] = useState({
    kuantitas: 1,
    harga: data?.price_product || 0,
  });

  const [quantity, setQuantity] = useState(1);

  const cartItemIds = (() => {
    try {
      const raw = sessionStorage.getItem("cartItemId");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const filterLocalCartByProductId = cartItemIds.filter(
    (cartItem) => cartItem?.product_id === data?.id
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.classList.add("open");
        }
      }, 10);
    } else {
      document.body.classList.remove("overflow-hidden");
      if (sheetRef.current) {
        sheetRef.current.classList.remove("open");
      }
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        getCart();
        onClose();
      }, 1060);
      return () => clearTimeout();
    }
  }, [success]);

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.classList.remove("open");
    }
    setTimeout(() => {
      onClose();
    }, 260);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantSelect = (variant) => setSelectedVariant(variant);

  const handleAddToCart = async (data, variant, quantity, isFromDetail) => {
    try {
      if (filterLocalCartByProductId?.length > 0) {
        const cartItemId = filterLocalCartByProductId[0]?.cart_id;
        const response = await updateCartItem(cartItemId, quantity);
        if (response?.success === true) {
          showSuccess("Produk Berhasil Diperbarui");
          setTimeout(() => setIsOpen(false), 1600);
        } else {
          showError(response?.error || "Produk Gagal Diperbarui");
          setTimeout(() => setIsOpen(false), 1600);
        }
      } else {
        const response = await addToCart(data, variant, quantity, isFromDetail);
        if (response?.success === true) {
          showSuccess("Produk Berhasil Ditambahkan");
          setTimeout(() => setIsOpen(false), 1600);
        } else {
          showError(response?.error || "Produk Gagal Ditambahkan");
          setTimeout(() => setIsOpen(false), 1600);
        }
      }
    } catch (error) {
      console.log(error);
      showError("Terjadi Kesalahan");
      setTimeout(() => setIsOpen(false), 1600);
    }
  };

  const getVariantPrice = (variant) => {
    return getProductPrice(data, variant?.id);
  };

  const getVariantStock = (variant) => {
    return getProductStock(data, variant?.id, isFromDetail);
  };

  const renderVariants = useMemo(() => {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden ${
          isDark ? "dark" : ""
        }`}
      >
        {/* Variants List */}
        <div className="max-h-60 overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pilih Varian:
          </h5>
          <div className="space-y-2">
            {data.skus?.map((variant) => {
              const price = getVariantPrice(variant);
              const stock = getVariantStock(variant);
              const isSelected = selectedVariant?.id === variant?.id;
              const isOutOfStock = stock <= 0;

              return (
                <button
                  key={variant.id}
                  className={`p-3 w-full rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-[var(--c-primary)] bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                >
                  <div className="flex items-center justify-between relative">
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
                      <div className="">
                        <div className="w-5 h-5 bg-[var(--c-primary)] rounded-full flex items-center justify-center absolute top-0 right-0">
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, [data, selectedVariant, quantity, isDark]);

  const totalPrice = formatCurrency(formData?.harga * quantity);

  useEffect(() => {
    if (!isOpen) setQuantity(1);
  }, [isOpen]);

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />

      {!isOpen ? null : (
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Bottom sheet container */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-sm w-full px-4 pointer-events-auto">
          <div
            ref={sheetRef}
            className="rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4 min-h-[70vh] max-h-[80vh] sheet overflow-y-auto relative"
            style={{
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
            }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center mb-3">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-slate-500" />
            </div>
            {/* Content wrapper adds bottom padding so footer doesn't overlap */}
            <div className="pb-24">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-primary dark:text-slate-300">
                  Detail Produk
                </h4>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-600 bg-gray-200 rounded-full p-1 hover:text-gray-900 dark:text-gray-300 dark:bg-slate-700 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* <button
                onClick={handleClose}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Tutup
              </button> */}
              </div>

              {/* Grid 3 cols with 3-2-1 layout */}
              <div className="flex gap-2 mb-4">
                <img
                  src={data?.image}
                  alt={data?.name}
                  className="w-28 h-20 object-cover object-center rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg">{data?.name}</h3>
                  <h3 className="font-medium text-lg">
                    Harga:{" "}
                    <span
                      className={`text-[var(--c-primary)] ${
                        isDark && "text-blue-300"
                      }`}
                    >
                      {formatCurrency(data?.price_product)}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {data?.is_variant ? renderVariants : null}
                <div className="flex items-center gap-2 ">
                  <SimpleInput
                    name="harga"
                    type="text"
                    label="Harga Pembelian"
                    value={totalPrice}
                    handleChange={handleChange}
                    disabled={true}
                  />
                  <ButtonQuantity
                    quantity={quantity}
                    setQuantity={setQuantity}
                    stocks={stocks}
                    style={{
                      marginTop: "20px",
                    }}
                  />
                </div>
              </div>
              {/* Absolute footer button at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600">
                <button
                  className={`w-full flex gap-2 justify-center items-center h-16 py-2 rounded-lg transition-colors bg-[var(--c-primary)] text-white hover:bg-blue-700`}
                  onClick={() =>
                    handleAddToCart(data, null, quantity, isFromDetail)
                  }
                  disabled={isLoading}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!isLoading ? "Masukkan Keranjang" : "Memproses..."}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
