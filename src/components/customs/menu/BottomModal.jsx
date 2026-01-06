import { useEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "../../../store/themeStore";
import { formatCurrency } from "../../../helper/currency";
import { useCartStore } from "../../../store/cartStore";
import { usePosStore } from "../../../store/posStore";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../toast/CustomToast";
import SimpleInput from "../form/SimpleInput";
import ButtonQuantity from "../button/ButtonQuantity";
import PropTypes from "prop-types";
import { ShoppingCart } from "lucide-react";

BottomModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  onClose: PropTypes.func,
  stocks: PropTypes.number,
  data: PropTypes.object,
  isFromDetail: PropTypes.bool,
  mode: PropTypes.oneOf(["cart", "custom"]),
  isVariant: PropTypes.bool,
  title: PropTypes.string,
  bodyHeight: PropTypes.string,
  children: PropTypes.node,
  initialSelectedVariant: PropTypes.object,
};

export default function BottomModal(props) {
  const {
    isOpen,
    setIsOpen,
    onClose,
    stocks,
    data,
    isFromDetail,
    mode = "cart",
    title,
    bodyHeight = "70vh",
    children,
    isVariant,
    initialSelectedVariant,
  } = props;

  const sheetRef = useRef(null);
  const { isDark } = useThemeStore();
  const { getProductStock } = usePosStore();
  const { addToCart, getCart, updateCartItem, success, isLoading } =
    useCartStore();
  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  // --- Swipe / Resize state (height in pixels) ---
  const [sheetHeight, setSheetHeight] = useState(null); // px
  const maxHeightRef = useRef(0); // px
  const hideThresholdRef = useRef(0); // px
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const isDraggingRef = useRef(false);

  // For momentum calculation and snapping
  const lastPositionsRef = useRef([]); // [{ y, t }]
  const snapRatios = [0.7, 0.85, 0.95];
  const snapHeightsRef = useRef([]);

  // parse bodyHeight prop like "70vh" or "400px"
  const parseBodyHeight = (val) => {
    try {
      if (!val) return window.innerHeight * 0.7;
      if (typeof val === "string" && val.endsWith("vh")) {
        const num = Number.parseFloat(val.replace("vh", ""));
        return (window.innerHeight * num) / 100;
      }
      if (typeof val === "string" && val.endsWith("px")) {
        return Number.parseFloat(val.replace("px", ""));
      }
      return Number.parseFloat(val) || window.innerHeight * 0.7;
    } catch {
      return window.innerHeight * 0.7;
    }
  };

  const computeSnapHeights = (wh) => {
    snapHeightsRef.current = snapRatios.map((r) => Math.floor(wh * r));
  };

  const initializeHeights = () => {
    const wh = window.innerHeight;
    maxHeightRef.current = Math.floor(wh * 0.95); // 95% of viewport
    hideThresholdRef.current = Math.floor(wh * 0.2); // 20% of viewport
    computeSnapHeights(wh);
    const initial = parseBodyHeight(bodyHeight);
    const boundedInitial = Math.min(initial, maxHeightRef.current);
    setSheetHeight(boundedInitial);

    if (sheetRef.current) {
      sheetRef.current.style.height = `${boundedInitial}px`;
      sheetRef.current.style.maxHeight = `${maxHeightRef.current}px`;
      sheetRef.current.style.transition = "height 200ms";
    }
  };

  useEffect(() => {
    // update responsive measurements on resize
    const onResize = () => {
      const wh = window.innerHeight;
      const prevMax = maxHeightRef.current || wh;
      const ratio = sheetHeight ? sheetHeight / prevMax : null;
      maxHeightRef.current = Math.floor(wh * 0.95);
      hideThresholdRef.current = Math.floor(wh * 0.2);
      computeSnapHeights(wh);
      const newHeight = ratio
        ? Math.min(
            Math.floor(maxHeightRef.current * ratio),
            maxHeightRef.current
          )
        : Math.min(parseBodyHeight(bodyHeight), maxHeightRef.current);
      setSheetHeight(newHeight);
      if (sheetRef.current)
        sheetRef.current.style.maxHeight = `${maxHeightRef.current}px`;
      if (sheetRef.current) sheetRef.current.style.height = `${newHeight}px`;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyHeight, sheetHeight]);

  const onDragStart = (clientY) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current =
      sheetHeight ||
      (sheetRef.current
        ? sheetRef.current.getBoundingClientRect().height
        : parseBodyHeight(bodyHeight));
    lastPositionsRef.current = [{ y: clientY, t: Date.now() }];
    if (sheetRef.current) sheetRef.current.style.transition = "none";
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  const immediateClose = () => {
    // stop dragging and cleanup listeners, then close
    isDraggingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    try {
      globalThis.removeEventListener("touchmove", touchMoveHandler);
      globalThis.removeEventListener("touchend", touchEndHandler);
      globalThis.removeEventListener("mousemove", mouseMoveHandler);
      globalThis.removeEventListener("mouseup", mouseUpHandler);
    } catch (e) {
      // ignore
    }
    if (sheetRef.current) {
      sheetRef.current.style.transition = "height 150ms ease";
      sheetRef.current.style.height = `0px`;
    }
    lastPositionsRef.current = [];
    setTimeout(() => {
      handleClose();
    }, 160);
  };

  const onDragMove = (clientY) => {
    if (!isDraggingRef.current) return;
    const delta = startYRef.current - clientY; // up => positive
    let newHeight = startHeightRef.current + delta;
    newHeight = Math.max(0, Math.min(newHeight, maxHeightRef.current));
    setSheetHeight(newHeight);
    if (sheetRef.current) sheetRef.current.style.height = `${newHeight}px`;

    // if sheet reduced below threshold while dragging, close immediately
    if (newHeight <= hideThresholdRef.current) {
      immediateClose();
      return;
    }

    // record last positions for velocity calculation (keep last 6)
    const positions = lastPositionsRef.current;
    positions.push({ y: clientY, t: Date.now() });
    if (positions.length > 6) positions.shift();
    lastPositionsRef.current = positions;
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // compute velocity (px/ms) from last two recorded positions
    const positions = lastPositionsRef.current;
    let velocity = 0;
    if (positions.length >= 2) {
      const last = positions[positions.length - 1];
      const prev = positions[positions.length - 2];
      const dy = prev.y - last.y; // positive if moving up
      const dt = last.t - prev.t; // ms
      if (dt > 0) velocity = dy / dt; // px per ms
    }

    // apply simple momentum prediction (ms multiplier)
    const momentumMs = 300; // how long the momentum lasts
    const predictedDelta = velocity * momentumMs; // pixels
    let targetHeight = sheetHeight + predictedDelta;
    targetHeight = Math.max(0, Math.min(targetHeight, maxHeightRef.current));

    // if predicted target below hide threshold => close
    if (targetHeight <= hideThresholdRef.current) {
      handleClose();
      lastPositionsRef.current = [];
      return;
    }

    // Decide whether to snap or keep released target
    const snaps = snapHeightsRef.current.slice();
    if (!snaps.includes(maxHeightRef.current)) snaps.push(maxHeightRef.current);

    // find nearest snap
    let nearest = snaps[0];
    let minDiff = Math.abs(snaps[0] - targetHeight);
    for (let i = 1; i < snaps.length; i++) {
      const diff = Math.abs(snaps[i] - targetHeight);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = snaps[i];
      }
    }

    // tolerance to decide snapping (4% of viewport height)
    const snapTolerance = Math.floor(window.innerHeight * 0.04);
    const velocityThreshold = 0.06; // px per ms

    // If we're close to a snap point OR there was enough flick velocity, consider snapping.
    // Avoid snapping *down* to a lower snap if the user dragged upwards (they likely want to keep the new size).
    const movedUp = targetHeight > startHeightRef.current;
    let shouldSnap =
      Math.abs(nearest - targetHeight) <= snapTolerance ||
      Math.abs(velocity) >= velocityThreshold;
    if (nearest < startHeightRef.current && movedUp) {
      shouldSnap = false;
    }

    const finalHeight = shouldSnap ? nearest : Math.round(targetHeight);

    if (sheetRef.current)
      sheetRef.current.style.transition =
        "height 350ms cubic-bezier(0.22, 1, 0.36, 1)";
    setSheetHeight(finalHeight);
    if (sheetRef.current) sheetRef.current.style.height = `${finalHeight}px`;

    lastPositionsRef.current = [];
  };

  // mouse handlers (desktop)
  const mouseMoveHandler = (e) => onDragMove(e.clientY);
  const mouseUpHandler = () => {
    onDragEnd();
    globalThis.removeEventListener("mousemove", mouseMoveHandler);
    globalThis.removeEventListener("mouseup", mouseUpHandler);
  };

  // touch handlers (mobile)
  const touchMoveHandler = (e) => {
    if (e.touches?.[0]) {
      e.preventDefault();
      onDragMove(e.touches[0].clientY);
    }
  };

  const touchEndHandler = () => {
    onDragEnd();
    globalThis.removeEventListener("touchmove", touchMoveHandler);
    globalThis.removeEventListener("touchend", touchEndHandler);
  };

  useEffect(() => {
    // if open, set initial height
    if (isOpen) {
      initializeHeights();
    }
    // cleanup on unmount
    return () => {
      document.body.style.userSelect = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ensure listeners removed on unmount in any case
  useEffect(() => {
    return () => {
      try {
        globalThis.removeEventListener("touchmove", touchMoveHandler);
        globalThis.removeEventListener("touchend", touchEndHandler);
        globalThis.removeEventListener("mousemove", mouseMoveHandler);
        globalThis.removeEventListener("mouseup", mouseUpHandler);
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const mappingApiKey = (params) => {
    if (params?.toLowerCase() === "price") {
      return isFromDetail ? "productPrices" : "product_prices";
    } else if (params?.toLowerCase() === "stock") {
      return isFromDetail ? "productStocks" : "product_stocks";
    }
  };

  const getPriceFunc = (isTotalPrice = false) => {
    const mapping = selectedVariant?.[mappingApiKey("price")]?.map(
      (item) => item?.price
    );

    return isTotalPrice
      ? Number?.parseInt(mapping[mapping?.length - 1]) * quantity
      : Number?.parseInt(mapping[mapping?.length - 1]);
  };

  const getStockFunc = () => {
    return selectedVariant?.[mappingApiKey("stock")]?.map((itemStock) =>
      quantity > itemStock?.qty ? setQuantity(itemStock?.qty) : itemStock?.qty
    );
  };

  const getProductPriceForDisplay = useMemo(() => {
    return selectedVariant ? getPriceFunc() : data?.price_product;
  }, [selectedVariant, data]);

  const [formData, setFormData] = useState({
    kuantitas: 1,
    harga: getProductPriceForDisplay,
  });

  const cartItemIds = (() => {
    try {
      const raw = sessionStorage.getItem("cartItemId");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const filterLocalCartByProductId = cartItemIds?.filter((cartItem) => {
    const cartProductId = cartItem?.product_id === data?.id;
    const cartVariantId = cartItem?.variant_id === selectedVariant?.id;

    if (data?.is_variant) {
      return cartProductId && cartVariantId;
    } else {
      return cartProductId;
    }
  });

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

  // Initialize selected variant from parent (detail page) or fallback to first variant in data
  useEffect(() => {
    if (initialSelectedVariant) {
      setSelectedVariant(initialSelectedVariant);
    } else if (
      data?.is_variant &&
      Array.isArray(data?.skus) &&
      data.skus.length > 0
    ) {
      setSelectedVariant(data.skus[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [initialSelectedVariant, data]);

  useEffect(() => {
    if (mode !== "cart") return;
    if (success) {
      setTimeout(() => {
        getCart();
        onClose();
      }, 1060);
      return () => clearTimeout();
    }
  }, [success, mode]);

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
    if (isVariant && selectedVariant === null) {
      showError("Pilih Varian Produk");
      return;
    }

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
        const response = await addToCart(
          data,
          selectedVariant,
          quantity,
          isFromDetail
        );
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

  const getVariantStock = (variant) => {
    return getProductStock(data, variant?.id, isFromDetail);
  };

  const getStocks = () => {
    const getApiKey = (apiData, apiKey) => apiData?.[apiKey]?.[0]?.qty;
    const keyApi = isFromDetail ? "productStocks" : "product_stocks";
    const keyData = data?.is_variant ? selectedVariant : data;
    return getApiKey(keyData, keyApi);
  };

  const totalPrice = useMemo(() => {
    if (data?.is_variant) {
      return selectedVariant === null ? 0 : formatCurrency(getPriceFunc(true));
    } else {
      return formatCurrency(formData?.harga * quantity);
    }
  }, [selectedVariant, data, quantity, formData, getPriceFunc]);

  const getPriceToDisplay = useMemo(() => {
    if (data?.is_variant) {
      return selectedVariant === null ? 0 : formatCurrency(getPriceFunc());
    } else {
      return formatCurrency(data?.price_product);
    }
  }, [data, selectedVariant, getPriceFunc]);

  const getStockToDisplay = useMemo(() => {
    if (data?.is_variant) {
      return selectedVariant === null ? 0 : getStockFunc();
    } else {
      return stocks;
    }
  }, [data, selectedVariant, stocks]);

  const renderVariants = useMemo(() => {
    return (
      <div
        className={`bg-white  rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden ${
          isDark ? "dark" : ""
        }`}
      >
        {/* Variants List */}
        <div className="max-h-[95vh] overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pilih Varian:
          </h5>
          <div className="flex flex-wrap gap-1">
            {data?.skus?.map((variant) => {
              const stock = getVariantStock(variant);
              const isSelected = selectedVariant?.id === variant?.id;
              const isOutOfStock = stock <= 0;

              return (
                <button
                  key={variant.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-[var(--c-primary)] dark:border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${
                    isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                  }  flex`}
                  onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex-1">
                      <div className="flex items-center relative">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {variant.variant_name}
                        </span>
                        {isOutOfStock && (
                          <span className="text-xs bg-red-100/90 text-red-600 rounded absolute top-0 left-0 w-full h-full">
                            Habis
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, [data, selectedVariant, quantity, isDark]);

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
          <button
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Bottom sheet container */}
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-sm w-full px-4 pointer-events-auto">
            <div
              ref={sheetRef}
              className={`rounded-t-3xl bg-white dark:bg-slate-700 shadow-soft p-4  max-h-[95vh] sheet overflow-y-auto relative`}
              style={{
                borderTopLeftRadius: "1.25rem",
                borderTopRightRadius: "1.25rem",
                height: sheetHeight ? `${sheetHeight}px` : undefined,
                maxHeight: maxHeightRef.current
                  ? `${maxHeightRef.current}px`
                  : undefined,
              }}
            >
              {/* Drag handle (mouse + touch) */}
              <div
                className="flex items-center justify-center mb-3 cursor-grab"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onDragStart(e.clientY);
                  globalThis.addEventListener("mousemove", mouseMoveHandler);
                  globalThis.addEventListener("mouseup", mouseUpHandler);
                }}
                onTouchStart={(e) => {
                  if (e.touches?.[0]) {
                    onDragStart(e.touches[0].clientY);
                    // attach touchmove listener as non-passive so preventDefault works
                    globalThis.addEventListener("touchmove", touchMoveHandler, {
                      passive: false,
                    });
                    globalThis.addEventListener("touchend", touchEndHandler);
                  }
                }}
              >
                <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-slate-500" />
              </div>
              {/* Content wrapper adds bottom padding so footer doesn't overlap */}
              {mode === "cart" ? (
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
                  </div>

                  {/* Grid 3 cols with 3-2-1 layout */}
                  <div className="flex gap-2 mb-4">
                    <img
                      src={data?.image}
                      alt={data?.name}
                      className="w-28 h-20 object-cover object-center rounded-lg"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg">{data?.name}</h3>
                      <h3 className="font-medium text-lg">
                        Harga:{" "}
                        <span
                          className={`text-[var(--c-primary)] ${
                            isDark && "text-blue-300"
                          }`}
                        >
                          {getPriceToDisplay}
                        </span>
                      </h3>
                      <h3 className="font-semibold text-md">
                        Stock: {getStocks()}
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
                        stocks={getStockToDisplay}
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
              ) : (
                <div className="pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-primary dark:text-slate-300">
                      {title || "Form"}
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
                  </div>
                  <div className="flex flex-col gap-3">{children}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
