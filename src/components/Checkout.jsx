import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useCheckoutStore } from "../store/checkoutStore";
import { formatCurrency } from "../helper/currency";
import { isEmpty } from "../helper/is-empty";
import SimpleInput from "./form/SimpleInput";

export default function Checkout() {
  const getCart = JSON.parse(sessionStorage.getItem("cart"));
  const [discountCode, setDiscountCode] = useState("");

  const {
    paymentData,
    getPaymentMethods,
    selectPaymentMethod,
    setSelectPaymentMethod,
  } = useCheckoutStore();
  const { checkVoucherDiscount, discountData, isLoading, error } =
    useCartStore();
  const { getPosSettings, posSettingsData } = useCheckoutStore();

  const checkTax = async () => await getPosSettings();

  const checkoutPrice = getCart?.items?.reduce(
    (a, b) => a + Number.parseInt(b.subtotal),
    0
  );

  const TOTAL = () => {
    if (!checkoutPrice) return 0;

    let taxPrice, discountPrice;

    if (!isEmpty(discountData)) getPriceWithDiscount();
    if (posSettingsData?.tax !== 0) getPriceWithTax();

    taxPrice = getPriceWithTax();
    discountPrice = getPriceWithDiscount();

    return { taxPrice, discountPrice };
  };

  const getPriceWithDiscount = () => {
    let price;

    if (discountData?.discount_type === "nominal") {
      price = discountData?.discount_value || 0;
    } else {
      price = (checkoutPrice * discountData?.discount_value) / 100 || 0;
    }

    return Number(price);
  };

  console.log(getPriceWithDiscount());

  const getPriceWithTax = () => {
    return (checkoutPrice * posSettingsData?.tax) / 100;
  };

  const getAndFormatTax = () => {
    const tax = posSettingsData?.tax;
    if ((!tax && tax !== 0) || Number.isNaN(Number(tax))) return "-";
    sessionStorage.setItem("tax", TOTAL()?.taxPrice);
    return Math.trunc(Number(tax));
  };

  const getTotalPrice = () => {
    const total = checkoutPrice + TOTAL()?.taxPrice - getPriceWithDiscount();
    sessionStorage.setItem("totalPayment", Math.ceil(total));
    return Math.ceil(total);
  };

  useEffect(() => {
    checkTax();
    getPaymentMethods();
  }, []);

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

  const handleChange = (e) => setSelectPaymentMethod(e.target.value);

  const renderElementsDetailTransaction = useMemo(() => {
    return (
      <div className="bg-white p-4 rounded-xl mb-24">
        <h3 className="font-semibold text-gray-700 text-lg mb-5">
          Detail Transaksi
        </h3>
        <div className="flex flex-col gap-2">
          {/* <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">
              Kode Transaksi
            </h4>
            <h4 className="font-bold text-gray-700 text-md">BRG-001-2K25</h4>
          </div> */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">
              Harga Barang ({Math.max(getCart?.items?.length > 0) || 0})
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {formatCurrency(checkoutPrice)}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">Diskon</h4>
            <h4 className="font-bold text-gray-700 text-md">
              -{formatCurrency(Math.ceil(getPriceWithDiscount() || 0))}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-500 text-md">Pajak</h4>
            <h4 className="font-bold text-gray-700 text-md">
              +{formatCurrency(Math.ceil(TOTAL()?.taxPrice) || 0)} (
              {getAndFormatTax()}
              %)
            </h4>
          </div>
          <div className="flex justify-between items-center border-t-2 border-gray-600 mt-2">
            <h4 className="font-bold text-gray-700 text-md mt-2">
              Total Tagihan
            </h4>
            <h4 className="font-bold text-gray-700 text-md">
              {formatCurrency(getTotalPrice())}
            </h4>
          </div>
        </div>
      </div>
    );
  }, [{ ...TOTAL() }, checkoutPrice, getCart?.items?.length]);

  useEffect(() => {
    if (discountData) {
      sessionStorage.setItem(
        "discount",
        JSON.stringify(getPriceWithDiscount())
      );
    }
  }, [discountData]);

  const inputClassName =
    "w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ring-1 ring-slate-600 dark:text-slate-200";

  return (
    <div className="w-full h-full p-4 rounded-lg flex flex-col gap-3">
      {getCart?.items?.map((data) => (
        <div
          className="flex items-center justify-between gap-2 w-full"
          key={data?.product_id}
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
                  value={discountCode?.toUpperCase()}
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
          value={selectPaymentMethod}
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
