import { useEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { formatCurrency } from "../helper/currency";
import { useCartStore } from "../store/cartStore";
import { usePosStore } from "../store/posStore";
import { toast, ToastContainer } from "react-toastify";
import SimpleInput from "./form/SimpleInput";
import ButtonQuantity from "./ButtonQuantity";
import PropTypes from "prop-types";
import { ShoppingCart } from "lucide-react";

BottomModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  stocks: PropTypes.number,
  data: PropTypes.object,
  isFromDetail: PropTypes.bool,
};

export default function BottomModal(props) {
  const { isOpen, onClose, stocks, data, isFromDetail = true } = props;

  const sheetRef = useRef(null);
  const { isDark } = useThemeStore();
  const { getProductPrice, getProductStock } = usePosStore();
  const { addToCart, getCart, success, isLoading } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [formData, setFormData] = useState({
    kuantitas: 1,
    harga: data?.price_product || 0,
  });

  const [quantity, setQuantity] = useState(1);

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

  const toastConfig = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handleAddToCart = async (data, variant, quantity, isFromDetail) => {
    const response = await addToCart(data, variant, quantity, isFromDetail);

    if (response?.ok || response?.status === 200) {
      toast.success("Berhasil Dimasukkan ke keranjang", {
        ...toastConfig,
      });
    } else {
      toast.error("Gagal Dimasukkan ke keranjang", {
        ...toastConfig,
      });
    }
  };

  const getVariantPrice = (variant) => {
    return getProductPrice(data, variant?.id);
  };

  const getVariantStock = (variant) => {
    return getProductStock(data, variant?.id, true);
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
      </div>
    );
  }, [data, selectedVariant, quantity, isDark]);

  const totalPrice = formatCurrency(formData?.harga * quantity);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {/* <button className="fixed inset-0 z-40" onClick={handleClose} /> */}

      <ToastContainer />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-[1.5rem] pointer-events-none z-10">
        <div className="mx-auto max-w-sm w-full mb-4 px-4 pointer-events-auto scrollbar-hide">
          <div
            ref={sheetRef}
            className="rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4 h-[460px] sheet overflow-y-auto mb-14"
            style={{
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-primary dark:text-slate-300">
                Detail Produk
              </h4>
              <button
                onClick={handleClose}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Tutup
              </button>
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
              <div className="w-full gap-2">
                <div className="mt-3">
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
                  {/* <button
                    className={`w-20 h-16 rounded-full border-2 border-gray-500 flex justify-center items-center transition-colors gap-2`}
                    onClick={() => handleAddToCart(data, null, quantity, true)}
                    disabled={true}
                  >
                    <img
                      src={`${
                        isDark ? "/icons/cart-white.svg" : "/icons/cart.svg"
                      }`}
                      alt="Add to cart"
                      className="w-8 h-8"
                    />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
