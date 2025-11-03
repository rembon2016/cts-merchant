import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useLocation } from "react-router-dom";
import { formatCurrency } from "../helper/currency";
import { toast, ToastContainer } from "react-toastify";
import CustomLoading from "./CustomLoading";
import SimpleModal from "./modal/SimpleModal";
import ButtonQuantity from "./ButtonQuantity";

const Cart = () => {
  const {
    cart,
    getCart,
    deleteCartItems,
    clearCart,
    selectedCart,
    setSelectedCart,
    isLoading,
    error,
    success,
    updateLocalCartItem,
  } = useCartStore();

  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const cartPath = location.pathname.includes("/cart");
  const activeBranch = sessionStorage.getItem("branchActive");

  useEffect(() => {
    if (!cartPath) return;
    if (!activeBranch) return;
    getCart();
  }, [cartPath, activeBranch]);

  const handleDeleteItems = async (cartId) => await deleteCartItems(cartId);

  const handleChecked = (event) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;
    const price = Number(checkbox.dataset.price);
    const subtotal = Number(checkbox.dataset.subtotal);
    const cartId = Number(checkbox.dataset.cartid);
    const itemId = Number(checkbox.id);
    const itemName = checkbox.dataset.name;
    const itemImage = checkbox.dataset.image;
    const itemQuantity = checkbox.dataset.quantity;
    const itemSku = checkbox.dataset.sku;

    if (isChecked) {
      const newItem = {
        cart_id: cartId,
        product_id: itemId,
        name: itemName,
        image: itemImage,
        product_sku_id: Number.parseInt(itemSku),
        quantity: itemQuantity,
        price,
        subtotal,
      };
      console.log(newItem);
      setSelectedCart((prevItems) => [...prevItems, newItem]);
    } else {
      // Remove by product_id (store uses product_id for selected items)
      setSelectedCart((prevItems) =>
        prevItems.filter((item) => String(item.product_id) !== String(itemId))
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

    // checkboxes.forEach((checkbox) => {
    //   checkbox.checked = isChecked;
    // });

    for (const checkbox of checkboxes) {
      checkbox.checked = isChecked;
    }

    if (isChecked) {
      const allItems = cart?.data?.items?.map((item) => ({
        product_id: item.product?.id ?? String(item.id),
        name: item.product.name,
        price: item.price,
        subtotal: item.subtotal,
        image: item.product.image,
        sku: Number.parseInt(item.product.sku),
        quantity: item.quantity,
      }));
      setSelectedCart(allItems);
    } else {
      setSelectedCart([]);
    }
  };

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  const handleDelete = () => clearCart(cart?.data?.id);

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

  // Show toast notifications when success/error changes
  useEffect(() => {
    if (success) {
      toast.success(typeof success === "string" ? success : "Berhasil", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (error) {
      toast.error(typeof error === "string" ? error : "Terjadi kesalahan", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [success, error]);

  const renderElement = useMemo(() => {
    const nullCartData =
      cart?.data?.items?.length === 0 ||
      cart?.data?.items === undefined ||
      cart?.data?.items === null;

    if (isLoading) {
      return (
        <div className="w-full text-center">
          {/* Loading indicator for infinite scroll */}
          <CustomLoading />
        </div>
      );
    }

    if (!isLoading && nullCartData) {
      return (
        <div className="w-full text-center">
          <p className="text-gray-800">Keranjang Kosong</p>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded-lg">
        {showModal && (
          <SimpleModal
            onClose={handleCloseModal}
            handleClick={handleDelete}
            title="Hapus Data"
            content="Kosongkan Keranjang?"
            showButton={true}
          />
        )}
        {/* toasts are triggered in useEffect when success/error change */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Keranjang Saya</h2>
          <div className="flex gap-1 items-center">
            <label htmlFor="select-all text-sm">
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
                  data-cartid={cartItem?.id}
                  data-price={cartItem?.price}
                  data-subtotal={cartItem?.subtotal}
                  data-name={cartItem?.product?.name}
                  data-image={cartItem?.product?.image}
                  data-sku={cartItem?.product?.sku}
                  data-quantity={cartItem?.quantity}
                  onChange={handleChecked}
                  className="cursor-pointer"
                />
                <img
                  src={getImageUrl(cartItem?.product?.image)}
                  alt={cartItem?.product?.name || "Product Image"}
                  className="w-20 h-20 rounded-lg"
                />
                <div key={cartItem?.id} className="flex flex-col">
                  <div className="font-bold text-md">
                    {cartItem?.product?.name}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-md">
                    <h3 className="font-medium">
                      Harga:{" "}
                      <span className="text-[var(--c-primary)] font-extrabold">
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
                onClick={() => handleDeleteItems(cartItem?.id)}
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
      <ToastContainer />
      {renderElement}
    </div>
  );
};

export default Cart;
