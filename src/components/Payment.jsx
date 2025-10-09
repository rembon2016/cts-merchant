import { useLocation } from "react-router-dom";
import { useCheckoutStore } from "../store/checkoutStore";
import { useEffect } from "react";
import SimpleInput from "./form/SimpleInput";

const Payment = () => {
  const { paymentData, getPaymentMethods } = useCheckoutStore();

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (pathname !== "/payment") return;
    getPaymentMethods();
  }, [pathname]);

  console.log("Payment Method: ", paymentData);

  return (
    <div className="mt-4 p-4 dark:bg-slate-700 bg-white rounded-lg mb-24">
      <h3 className="font-semibold text-gray-700 text-lg mb-5">Pembayaran</h3>
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="jumlahBarang"
          type="number"
          label="Jumlah Barang"
          value={1}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="harga"
          type="number"
          label="Harga"
          value={13000}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="biayaTambahan"
          type="number"
          label="Biaya Tambahan"
          value={6000}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="JenisPembayaran"
          type="text"
          label="Jenis Pembayaran"
          isSelectBox={true}
          selectBoxData={paymentData}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="totalHarga"
          type="number"
          label="Total Harga"
          value={19000}
          disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
      </div>
    </div>
  );
};

export default Payment;
