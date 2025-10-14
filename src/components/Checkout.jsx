import { useEffect, useMemo, useState, useRef } from "react";
import { useCartStore } from "../store/cartStore";
import { useCheckoutStore } from "../store/checkoutStore";
import { formatCurrency } from "../helper/currency";
import CustomLoading from "./CustomLoading";
import SimpleInput from "./form/SimpleInput";
import SimpleModal from "./modal/SimpleModal";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const getCart = JSON.parse(sessionStorage.getItem("cart"));
  const [discountCode, setDiscountCode] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  // const [showExitModal, setShowExitModal] = useState(false);

  const { paymentData, getPaymentMethods } = useCheckoutStore();
  const { checkVoucherDiscount, isLoading, error } = useCartStore();
  const {
    getPosSettings,
    posSettingsData,
    isLoading: loadingPos,
  } = useCheckoutStore();

  const checkTax = async () => await getPosSettings();

  const checkoutPrice = getCart?.items?.reduce(
    (a, b) => a + parseFloat(b.subtotal),
    0
  );

  const TOTAL = checkoutPrice + checkoutPrice * (posSettingsData?.tax / 100);

  useEffect(() => {
    checkTax();
    getPaymentMethods();
  }, []);

  // Navigation guard: show confirmation modal when user tries to leave checkout
  // useEffect(() => {
  //   const onPop = (e) => {
  //     if (allowNavRef.current) return;
  //     // prevent immediate navigation and show modal
  //     e.preventDefault();
  //     // re-push state so the user stays on this page
  //     try {
  //       window.history.pushState(null, "");
  //     } catch (err) {
  //       // ignore
  //     }
  //     setShowExitModal(true);
  //   };

  //   const onBeforeUnload = (e) => {
  //     // show native prompt for refresh/close
  //     e.preventDefault();
  //     e.returnValue = "";
  //     setShowExitModal(true);
  //     return "";
  //   };

  //   onPopRef.current = onPop;
  //   beforeUnloadRef.current = onBeforeUnload;

  //   // push an extra history entry so back button triggers popstate
  //   try {
  //     window.history.pushState(null, "");
  //   } catch (err) {
  //     // ignore
  //   }
  //   window.addEventListener("popstate", onPopRef.current);
  //   window.addEventListener("beforeunload", beforeUnloadRef.current);

  //   return () => {
  //     window.removeEventListener("popstate", onPopRef.current);
  //     window.removeEventListener("beforeunload", beforeUnloadRef.current);
  //   };
  // }, []);

  // const handleConfirmLeave = () => {
  //   // allow navigation and remove session cart
  //   allowNavRef.current = true;
  //   try {
  //     sessionStorage.removeItem("cart");
  //   } catch (err) {
  //     // ignore
  //   }
  //   setShowExitModal(false);
  //   // cleanup listeners then navigate back (or to home if no history)
  //   if (onPopRef.current)
  //     window.removeEventListener("popstate", onPopRef.current);
  //   if (beforeUnloadRef.current)
  //     window.removeEventListener("beforeunload", beforeUnloadRef.current);
  //   // Use native history.back() so the browser actually goes to the previous entry
  //   // (react-router navigate(-1) may not behave as expected when we manipulated
  //   // history with pushState). Fallback to navigate(-1) if needed.
  //   if (window.history.length > 1) {
  //     try {
  //       window.history.back();
  //     } catch (err) {
  //       navigate(-1);
  //     }
  //   } else navigate("/");
  // };

  // Tambahkan base URL untuk gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // Sesuaikan dengan URL backend Anda
    const baseUrl = import.meta.env.VITE_API_IMAGE;
    return `${baseUrl}${imagePath}`;
  };

  const checkDiscountCode = async (e) => {
    e?.preventDefault();
    await checkVoucherDiscount(discountCode);
  };

  const handleChange = (e) => setSelectedData(e.target.value);

  const renderElementsDetailTransaction = useMemo(() => {
    if (loadingPos) {
      return (
        <div className="w-full text-center">
          <CustomLoading />
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-xl mb-24">
        <h3 className="font-semibold text-gray-700 text-lg mb-5">
          Detail Transaksi
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">
              Kode Transaksi
            </h4>
            <h4 className="font-bold text-gray-700 text-md">BRG-001-2K25</h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">
              Harga Barang (
              {getCart?.items?.length > 0 ? getCart?.items?.length : 0})
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {formatCurrency(checkoutPrice)}
            </h4>
          </div>
          {/* <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">
              Biaya Layanan
            </h4>
            <h4 className="font-bold text-gray-700 text-md">Rp. 1.000</h4>
          </div> */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">Diskon</h4>
            <h4 className="font-bold text-gray-700 text-md">
              {formatCurrency(0)}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">Pajak</h4>
            <h4 className="font-bold text-gray-700 text-md">
              {(() => {
                const tax = posSettingsData?.tax;
                const num = Number(tax);
                if (!tax && tax !== 0) return "-";
                if (Number.isNaN(num)) return "-";
                return Math.trunc(num);
              })()}
              %
            </h4>
          </div>
          <div className="flex justify-between items-center border-t-2 border-gray-600 mt-2">
            <h4 className="font-bold text-gray-700 text-md mt-2">
              Total Tagihan
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {formatCurrency(TOTAL)}
            </h4>
          </div>
        </div>
      </div>
    );
  }, [loadingPos, posSettingsData, checkoutPrice, TOTAL]);

  const inputClassName =
    "w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ring-1 ring-slate-600 dark:text-slate-200";

  return (
    <div className="w-full h-full p-4 rounded-lg flex flex-col gap-3">
      {getCart?.items?.map((data) => (
        <div
          className="flex items-center justify-between gap-2 w-full"
          key={data?.id}
        >
          <div className="flex gap-2 items-center bg-white w-full p-4 rounded-xl">
            <img
              src={getImageUrl(data?.image)}
              alt={data?.name || "Product Image"}
              className="w-24 h-16 object-contain"
            />
            <div key={data?.id} className="flex flex-col">
              <div className="font-bold text-xl">{data?.name}</div>
              <div className="text-gray-700 dark:text-gray-200 text-lg">
                <h3 className="font-medium">
                  Harga:{" "}
                  <span className="text-[var(--c-primary)] font-extrabold">
                    {formatCurrency(data?.price)}
                  </span>
                </h3>
              </div>
              {/* <div className="text-xs text-gray-400">{notif.date}</div> */}
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white p-4 rounded-xl">
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-xl">Voucher Diskon</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="voucher" className="text-lg font-regular">
              Masukkan Kode Voucher
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={inputClassName}
                  placeholder="Masukkan kode voucher"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button
                  className="text-lg text-[var(--c-primary)] font-bold bg-[var(--c-accent)] max-w-[100px] w-full rounded-lg"
                  onClick={checkDiscountCode}
                  disabled={discountCode === ""}
                >
                  {isLoading ? "Tunggu..." : "Cek"}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-400">
                  Voucher diskon tidak tersedia
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <SimpleInput
          name="JenisPembayaran"
          type="text"
          label="Jenis Pembayaran"
          isSelectBox={true}
          selectBoxData={paymentData}
          value={selectedData}
          handleChange={handleChange}
          //   errors={errors.password}
          //   disabled={!isEditPassword}
        />
      </div>

      {renderElementsDetailTransaction}

      {/* {showExitModal && (
        <SimpleModal
          onClose={() => setShowExitModal(false)}
          handleClick={handleConfirmLeave}
          title={"Konfirmasi Keluar"}
          content={
            "Anda yakin ingin meninggalkan halaman checkout? Keranjang sesi akan dihapus."
          }
          showButton={true}
        />
      )} */}
    </div>
  );
}
