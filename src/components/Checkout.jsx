import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useCheckoutStore } from "../store/checkoutStore";
import CustomLoading from "./CustomLoading";

export default function Checkout() {
  const getCart = sessionStorage.getItem("cart");

  const [dataCheckout, setDataCheckout] = useState([]);
  const [discountCode, setDiscountCode] = useState("");

  const { checkVoucherDiscount, isLoading, error } = useCartStore();
  const {
    getPosSettings,
    posSettingsData,
    isLoading: loadingPos,
  } = useCheckoutStore();

  const checkTax = async () => await getPosSettings();

  const checkoutPrice = dataCheckout?.items?.reduce((a, b) => a + b.price, 0);
  const TOTAL = checkoutPrice + posSettingsData?.tax;

  useEffect(() => {
    if (getCart !== undefined) {
      setDataCheckout(JSON.parse(getCart));
    }
  }, [getCart]);

  useEffect(() => {
    checkTax();
  }, []);

  let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

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
              Harga Barang ({dataCheckout?.items?.length})
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {Rupiah.format(checkoutPrice)}
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
              {Rupiah.format(0)}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">Pajak</h4>
            <h4 className="font-bold text-gray-700 text-md">
              {Rupiah.format(posSettingsData?.tax)}
            </h4>
          </div>
          <div className="flex justify-between items-center border-t-2 border-gray-600 mt-2">
            <h4 className="font-bold text-gray-700 text-md mt-2">
              Total Tagihan
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {Rupiah.format(TOTAL)}
            </h4>
          </div>
        </div>
      </div>
    );
  }, [loadingPos, dataCheckout, posSettingsData, checkoutPrice, TOTAL]);

  const inputClassName =
    "w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ring-1 ring-slate-600 dark:text-slate-200";

  return (
    <div className="w-full h-full p-4 rounded-lg flex flex-col gap-3">
      {dataCheckout?.items?.map((data) => (
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
                    {Rupiah.format(data?.price)}
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

      {renderElementsDetailTransaction}
    </div>
  );
}
