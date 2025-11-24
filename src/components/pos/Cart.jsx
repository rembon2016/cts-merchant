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

    if (isChecked) {
      const newItem = {
        cart_id: cartId, // Main cart ID for clearing
        item_id: itemCartId, // Cart item ID for reference
        product_id: productId,
        name: itemName,
        image: itemImage,
        product_sku_id: Number.parseInt(itemSku),
        quantity: itemQuantity,
        price,
        subtotal,
      };
      setSelectedCart((prevItems) => [...prevItems, newItem]);
    } else {
      // Remove by product_id (store uses product_id for selected items)
      setSelectedCart((prevItems) =>
        prevItems.filter(
          (item) => String(item.product_id) !== String(productId)
        )
      );
    }

    // Update "Pilih Semua" checkbox state after each change
    setTimeout(() => {
      const itemCheckboxes = document.querySelectorAll(
        'input[type="checkbox"]:not(#select-all)'
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
      const allItems = cart?.data?.items?.map((item) => ({
        cart_id: item?.cart_id, // Use the main cart ID, not item ID
        item_id: item?.id, // Store the item ID separately
        product_id: item?.product_id ?? String(item?.id),
        name: item.product?.name,
        price: item?.price,
        subtotal: item?.subtotal,
        image: item?.product?.image,
        product_sku_id: Number.parseInt(item?.product?.sku),
        quantity: item?.quantity,
      }));
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
      return (
        <div className="w-full text-center">
          {/* Loading indicator for infinite scroll */}
          <CustomLoading />
        </div>
      );
    }

    if (!isLoading && nullCartData) {
      return <NoData text="Keranjang Kosong" />;
    }

    return (
      <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded-lg">
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
                  data-price={cartItem?.price}
                  data-cartid={cartItem?.cart_id}
                  data-productid={cartItem?.product_id}
                  data-itemid={cartItem?.id}
                  data-subtotal={cartItem?.subtotal}
                  data-name={cartItem?.product?.name}
                  data-image={cartItem?.product?.image}
                  data-sku={cartItem?.product?.product_sku_id}
                  data-quantity={cartItem?.quantity}
                  onChange={handleChecked}
                  className="cursor-pointer"
                />
                <img
                  src={getImageUrl(cartItem?.product?.image)}
                  alt={cartItem?.product?.name || "Product Image"}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div key={cartItem?.id} className="flex flex-col">
                  <div className="font-bold text-base">
                    {cartItem?.product?.name.slice(0, 20) + "..."}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-md">
                    <h3 className="font-medium">
                      {/* Harga:{" "} */}
                      <span className="text-gray-500 font-extrabold">
                        {formatCurrency(cartItem?.price)}
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
                        const price = Number(cartItem?.price ?? 0);
                        const subtotal = price * Number(newQty);

                        const matchByPid = (it) =>
                          String(it.product_id ?? it.id) === String(pid);

                        // If exists, update price, subtotal and quantity
                        if (prevItems.some(matchByPid)) {
                          return prevItems.map((it) =>
                            matchByPid(it)
                              ? { ...it, price, subtotal, quantity: newQty }
                              : it
                          );
                        }

                        // add new selected item (normalize shape)
                        const newItem = {
                          product_id: pid,
                          product_sku_id:
                            cartItem?.product_sku_id ??
                            cartItem?.product?.sku ??
                            null,
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
                          String(cartItem?.product?.id)
                        );
                        if (cb && !cb.checked) {
                          cb.checked = true;
                          // Trigger change handler so selectedCart will include item if necessary
                          cb.dispatchEvent(
                            new Event("change", { bubbles: true })
                          );
                        }

                        // Update select-all state
                        const itemCheckboxes = document.querySelectorAll(
                          'input[type="checkbox"]:not(#select-all)'
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
                    stocks={cartItem?.stock ?? cartItem?.product?.stock ?? 9999}
                  />
                </div>
              </div>
              <button
                className="shadow-lg hover:shadow-none transition-all ease-in"
                onClick={() =>
                  handleOpenItemModal(
                    cartItem?.id,
                    cartItem?.product?.name || cartItem?.name
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
