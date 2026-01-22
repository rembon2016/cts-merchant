import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useLocation } from "react-router-dom";
import { formatCurrency } from "../../helper/currency";
import { useCustomToast } from "../../hooks/useCustomToast";
import { isEmpty } from "../../helper/is-empty";
import NoData from "../customs/element/NoData";
import CustomLoading from "../customs/loading/CustomLoading";
import ButtonQuantity from "../customs/button/ButtonQuantity";
import SimpleModal from "../customs/modal/SimpleModal";
import CustomToast from "../customs/toast/CustomToast";
import CustomImage from "../customs/element/CustomImage";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";

const Cart = () => {
  const {
    cart,
    getCart,
    deleteCartItems,
    clearAllCart,
    setSelectedCart,
    isLoading,
    error,
    success,
    updateLocalCartItem,
  } = useCartStore();

  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const [showModal, setShowModal] = useState(false);
  const [confirmMode, setConfirmMode] = useState(null); // 'clear' | 'item'
  const [pendingItemId, setPendingItemId] = useState(null);

  const location = useLocation();
  const cartPath = location.pathname.includes("/cart");
  const activeBranch = sessionStorage.getItem("branchActive");

  useEffect(() => {
    if (!cartPath) return;
    if (!activeBranch) return;
    getCart();
  }, [cartPath, activeBranch]);

  const handleChecked = (event) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;
    const price = Number(checkbox.dataset.price);
    const subtotal = Number(checkbox.dataset.subtotal);
    const productId = Number(checkbox.dataset.productid); // Product ID for selection
    const cartId = checkbox.dataset.cartid; // Main cart ID
    const itemCartId = checkbox.dataset.itemid; // Cart item ID
    const itemName = checkbox.dataset.name;
    const itemImage = checkbox.dataset.image;
    const itemQuantity = checkbox.dataset.quantity;
    const itemSku = checkbox.dataset.sku;
    const itemVariantName = checkbox.dataset.variant_name;

    if (isChecked) {
      const newItem = {
        cart_id: cartId, // Main cart ID for clearing
        item_id: itemCartId, // Cart item ID for reference
        product_id: productId,
        name: itemName,
        image: itemImage,
        product_sku_id: Number.parseInt(itemSku),
        variant_name: itemVariantName,
        quantity: itemQuantity,
        price,
        subtotal,
      };
      setSelectedCart((prevItems) => [...prevItems, newItem]);
    } else {
      // Remove by product_id (store uses product_id for selected items)
      setSelectedCart((prevItems) =>
        prevItems.filter(
          (item) => String(item.product_id) !== String(productId),
        ),
      );
    }

    // Update "Pilih Semua" checkbox state after each change
    setTimeout(() => {
      const itemCheckboxes = document.querySelectorAll(
        'input[type="checkbox"]:not(#select-all)',
      );
      const allChecked =
        Array.from(itemCheckboxes).length > 0 &&
        Array.from(itemCheckboxes).every((cb) => cb.checked);
      const selectAllCheckbox = document.getElementById("select-all");
      if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
    }, 0);
  };

  const handleSelectAll = (event) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (const checkbox of checkboxes) {
      checkbox.checked = isChecked;
    }

    if (isChecked) {
      const allItems = cart?.data?.items?.map((item) => {
        const variantPrice = item?.product_sku?.product_prices?.map(
          (priceItem) => priceItem?.price,
        );
        return {
          cart_id: item?.cart_id, // Use the main cart ID, not item ID
          item_id: item?.id, // Store the item ID separately
          product_id: item?.product_id ?? String(item?.id),
          name: item.product?.name,
          price: item?.product?.is_variant
            ? Number(variantPrice)
            : item?.product?.price_product,
          subtotal: item?.subtotal,
          image: item?.product?.image,
          product_sku_id: Number.parseInt(item?.product_sku_id) || null,
          variant_name: item?.product_sku?.variant_name || null,
          quantity: item?.quantity,
        };
      });
      setSelectedCart(allItems);
    } else {
      setSelectedCart([]);
    }
  };

  const handleOpenModal = () => {
    setConfirmMode("clear");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmDelete = () => {
    // Close modal immediately to prevent reappearing due to store updates
    setShowModal(false);
    // Reset modal state
    setConfirmMode(null);
    setPendingItemId(null);

    // Proceed with deletion
    if (confirmMode === "item" && pendingItemId) {
      deleteCartItems(pendingItemId)
        .then(() => {
          showSuccess("Item berhasil dihapus");
        })
        .catch(() => {
          showError("Gagal menghapus item");
        });
    } else {
      // For clearing all cart, use the cart ID (not item IDs)
      const cartIds = [cart?.data?.id].filter(Boolean);
      clearAllCart(cartIds)
        .then(() => {
          showSuccess("Semua item berhasil dihapus");
        })
        .catch(() => {
          showError("Gagal menghapus semua item");
        });
    }
  };

  const handleOpenItemModal = (itemId) => {
    setPendingItemId(itemId);
    setConfirmMode("item");
    setShowModal(true);
  };

  // Tambahkan base URL untuk gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // Sesuaikan dengan URL backend Anda
    const baseUrl = import.meta.env.VITE_API_IMAGE;
    return `${baseUrl}${imagePath}`;
  };

  useEffect(() => {
    if (success) setShowModal(false);
    if (error) setShowModal(false);
  }, [success, error]);

  const renderElement = useMemo(() => {
    const nullCartData = isEmpty(cart?.data?.items);

    if (isLoading) {
      return <LoadingSkeletonList />;
    }

    if (!isLoading && nullCartData) {
      return <NoData text="Keranjang Kosong" />;
    }

    return (
      <div className="mt-2 p-4 bg-white dark:bg-slate-700 rounded-lg mb-[10rem]">
        {showModal && (
          <SimpleModal
            onClose={handleCloseModal}
            handleClick={handleConfirmDelete}
            title="Hapus Data"
            content={
              confirmMode === "clear"
                ? "Kosongkan Keranjang?"
                : "Hapus Produk Ini?"
            }
            showButton={true}
          />
        )}
        {/* toasts are triggered in useEffect when success/error change */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Keranjang Saya</h2>
          <div className="flex gap-1 items-center">
            <label htmlFor="select-all text-base">
              Pilih Semua{" "}
              <input
                type="checkbox"
                name="select-all"
                id="select-all"
                onChange={handleSelectAll}
              />
            </label>
            {cart?.data?.items?.length > 0 && (
              <button
                className="shadow-lg hover:shadow-none transition-all ease-in"
                onClick={handleOpenModal}
              >
                <svg
                  width="24"
                  height="25"
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
              </button>
            )}
          </div>
        </div>
        {cart?.data?.items?.map((cartItem) => {
          const variantStock = cartItem?.product_sku?.product_stocks?.[0]?.qty;
          const nonVariantStock = cartItem?.product?.product_stocks?.[0]?.qty;
          const variantPrice =
            cartItem?.product_sku?.product_prices?.[0]?.price;
          const priceProduct = cartItem?.product?.is_variant
            ? variantPrice
            : cartItem?.product?.price_product;
          return (
            <div
              className="flex items-center justify-between gap-2 w-full my-6"
              key={cartItem?.id}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name={cartItem?.product?.name}
                  id={cartItem?.product?.id}
                  data-price={priceProduct}
                  data-cartid={cartItem?.cart_id}
                  data-productid={cartItem?.product_id}
                  data-itemid={cartItem?.id}
                  data-subtotal={cartItem?.subtotal}
                  data-name={cartItem?.product?.name}
                  data-image={cartItem?.product?.image}
                  data-sku={cartItem?.product_sku_id}
                  data-variant_name={cartItem?.product_sku?.variant_name}
                  data-quantity={cartItem?.quantity}
                  onChange={handleChecked}
                  className="cursor-pointer"
                />
                <CustomImage
                  imageSource={getImageUrl(cartItem?.product?.image)}
                  imageWidth={96}
                  imageHeight={64}
                  altImage={cartItem?.product?.name || "Product Image"}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                  imageLoad="eager"
                  imageFetchPriority="high"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div key={cartItem?.id} className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="font-bold text-base">
                      {cartItem?.product?.name.slice(0, 15) + "..."}
                    </div>
                    {cartItem?.product?.is_variant && (
                      <span className="text-sm font-semibold bg-gray-200 w-fit py-1 px-2 rounded-lg text-gray-500 dark:text-gray-300">
                        {cartItem?.product_sku?.variant_name}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-md">
                    <h3 className="font-medium">
                      {/* Harga:{" "} */}
                      <span className="text-gray-500 dark:text-gray-300 font-extrabold">
                        {formatCurrency(priceProduct)}
                      </span>
                    </h3>
                  </div>
                  <ButtonQuantity
                    quantity={cartItem?.quantity}
                    setQuantity={(newQty) => {
                      // Update local cart store (frontend only)
                      if (updateLocalCartItem) {
                        updateLocalCartItem(cartItem.id, newQty);
                      }

                      // Ensure selectedCart is updated (add or update) so totals reflect quantity changes
                      setSelectedCart((prevItems) => {
                        const pid = cartItem?.product?.id ?? cartItem?.id;
                        const price = Number.parseInt(
                          cartItem?.product?.is_variant
                            ? cartItem?.product_sku?.product_prices?.[0]?.price
                            : (cartItem?.product?.price_product ?? 0),
                        );
                        const subtotal = price * Number(newQty);

                        const matchByPid = (it) =>
                          String(it.product_id ?? it.id) === String(pid);

                        // If exists, update price, subtotal and quantity
                        if (prevItems.some(matchByPid)) {
                          return prevItems.map((it) =>
                            matchByPid(it)
                              ? { ...it, price, subtotal, quantity: newQty }
                              : it,
                          );
                        }

                        // add new selected item (normalize shape)
                        const newItem = {
                          item_id: cartItem?.id,
                          cart_id: cartItem?.cart_id,
                          product_id: pid,
                          product_sku_id: cartItem?.product_sku_id ?? null,
                          quantity: newQty,
                          name: cartItem?.product?.name || cartItem?.name || "",
                          image:
                            cartItem?.product?.image || cartItem?.image || "",
                          price,
                          subtotal,
                        };

                        return [...prevItems, newItem];
                      });
                      // Programmatically check the checkbox for this product
                      setTimeout(() => {
                        // checkbox id uses product id in the markup
                        const cb = document.getElementById(
                          String(cartItem?.product?.id),
                        );
                        if (cb && !cb.checked) {
                          cb.checked = true;
                          // Trigger change handler so selectedCart will include item if necessary
                          cb.dispatchEvent(
                            new Event("change", { bubbles: true }),
                          );
                        }

                        // Update select-all state
                        const itemCheckboxes = document.querySelectorAll(
                          'input[type="checkbox"]:not(#select-all)',
                        );
                        const allChecked =
                          Array.from(itemCheckboxes).length > 0 &&
                          Array.from(itemCheckboxes).every((c) => c.checked);
                        const selectAllCheckbox =
                          document.getElementById("select-all");
                        if (selectAllCheckbox)
                          selectAllCheckbox.checked = allChecked;
                      }, 0);
                    }}
                    stocks={
                      cartItem?.product?.is_variant
                        ? variantStock
                        : nonVariantStock
                    }
                  />
                </div>
              </div>
              <button
                className="shadow-lg hover:shadow-none transition-all ease-in"
                onClick={() =>
                  handleOpenItemModal(
                    cartItem?.id,
                    cartItem?.product?.name || cartItem?.name,
                  )
                }
              >
                <svg
                  width="24"
                  height="25"
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
              </button>
            </div>
          );
        })}
      </div>
    );
  }, [cart, isLoading, error, success, showModal]);

  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    };

    const mappingImage =
      cart?.data?.items?.map((item) => item?.product?.image) || [];
    mappingImage.forEach((src) => preloadImage(src));
  }, [cart?.data?.items]);

  return (
    <div className="p-6">
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      {renderElement}
    </div>
  );
};

export default Cart;
