import { useEffect, useMemo } from "react";
import { useCartStore } from "../store/cartStore";
import { useTotalPriceStore } from "../store/totalPriceStore";
import { useLocation } from "react-router-dom";
import CustomLoading from "./CustomLoading";
import SimpleAlert from "./alert/SimpleAlert";

const Cart = () => {
  const { cart, getCart, deleteCart, setSelectedCart, isLoading, error } =
    useCartStore();
  const { setTotalPrice } = useTotalPriceStore();

  const location = useLocation();
  const cartPath = location.pathname.includes("/cart");
  const activeBranch = sessionStorage.getItem("branchActive");

  useEffect(() => {
    if (!cartPath) return;
    if (!activeBranch) return;
    getCart();
  }, [cartPath, activeBranch]);

  let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const handleDeleteItems = async (cartId) => await deleteCart(cartId);

  const handleChecked = (event) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;
    const price = Number(checkbox.dataset.price);
    const itemId = Number(checkbox.id);
    const itemName = checkbox.dataset.name;
    const itemImage = checkbox.dataset.image;

    if (isChecked) {
      const newItem = { id: itemId, name: itemName, price, image: itemImage };
      setSelectedCart((prevItems) => [...prevItems, newItem]);

      setTotalPrice((prevTotal) => prevTotal + price);
    } else {
      setSelectedCart((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );

      setTotalPrice((prevTotal) => prevTotal - price);
    }
  };

  const handleSelectAll = (event) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });

    if (isChecked) {
      const allItems = cart?.data?.items?.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      }));
      setSelectedCart(allItems);

      const total = cart?.data?.items?.reduce(
        (acc, item) => Number(acc) + Number(item.price),
        0
      );

      setTotalPrice(total);
    } else {
      setSelectedCart([]);

      setTotalPrice(0);
    }
  };

  // Tambahkan base URL untuk gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // Sesuaikan dengan URL backend Anda
    const baseUrl = import.meta.env.VITE_API_IMAGE;
    return `${baseUrl}${imagePath}`;
  };

  // Reset totalPrice when cart is empty or component unmounts
  useEffect(() => {
    if (!cart?.data?.items || cart?.data?.items?.length === 0) {
      setTotalPrice(0);
    }
  }, [cart?.data?.items]);

  const renderElement = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full text-center">
          {/* Loading indicator for infinite scroll */}
          <CustomLoading />
        </div>
      );
    }

    if (!isLoading && cart?.data?.length === 0) {
      return (
        <div className="w-full text-center">
          <p className="text-gray-500">Keranjang Kosong</p>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded-lg">
        {error && (
          <SimpleAlert
            type={error ? "error" : null}
            textContent={"Failed to delete cart item"}
          />
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Keranjang Saya</h2>
          <label htmlFor="select-all">
            Pilih Semua{" "}
            <input
              type="checkbox"
              name="select-all"
              id="select-all"
              onChange={handleSelectAll}
            />
          </label>
        </div>
        {cart?.data?.items?.map((cartItem) => {
          return (
            <div
              className="flex items-center justify-between gap-2 w-full mb-6"
              key={cartItem?.id}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name={cartItem?.product?.name}
                  id={cartItem?.product?.id}
                  data-price={cartItem?.price}
                  data-name={cartItem?.product?.name}
                  data-image={cartItem?.product?.image}
                  onChange={handleChecked}
                  className="cursor-pointer"
                />
                <img
                  src={getImageUrl(cartItem?.product?.image)}
                  alt={cartItem?.product?.name || "Product Image"}
                  className="w-16 h-16"
                />
                <div key={cartItem?.id} className="flex flex-col">
                  <div className="font-bold text-md">
                    {cartItem?.product?.name}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-md">
                    <h3 className="font-medium">
                      Harga:{" "}
                      <span className="text-[var(--c-primary)] font-extrabold">
                        {Rupiah.format(cartItem?.price)}
                      </span>
                    </h3>
                  </div>
                  {/* <div className="text-xs text-gray-400">{notif.date}</div> */}
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
  }, [cart, isLoading]);

  return <div className="p-6">{renderElement}</div>;
};

export default Cart;
