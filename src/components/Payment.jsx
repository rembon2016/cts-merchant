import { useLocation } from "react-router-dom";
import { useCheckoutStore } from "../store/checkoutStore";
import { useEffect, useState } from "react";
import SimpleInput from "./form/SimpleInput";

const Payment = () => {
  const getCart = sessionStorage.getItem("cart");

  const [dataCheckout, setDataCheckout] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const { paymentData, getPaymentMethods } = useCheckoutStore();

  const location = useLocation();
  const pathname = location.pathname;

  const totalPrice = dataCheckout?.items?.reduce((a, b) => a + b.price, 0) || 0;

  const handleChange = (e) => setSelectedData(e.target.value);

  useEffect(() => {
    if (pathname !== "/payment") return;
    getPaymentMethods();
  }, [pathname, sessionStorage.getItem("authPosToken")]);

  useEffect(() => {
    if (getCart !== undefined) {
      setDataCheckout(JSON.parse(getCart));
    }
  }, []);

  return (
    <div className="mt-4 p-4 dark:bg-slate-700 bg-white rounded-lg mb-24">
      <h3 className="font-semibold text-gray-700 text-lg mb-5">Pembayaran</h3>
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="jumlahBarang"
          type="number"
          label="Jumlah Barang"
          value={dataCheckout?.items?.length || 0}
          disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="harga"
          type="number"
          label="Harga"
          value={dataCheckout?.items?.reduce((a, b) => a + b.price, 0) || 0}
          disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        {/* <SimpleInput
          name="biayaTambahan"
          type="number"
          label="Biaya Tambahan"
          value={6000}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        /> */}
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
        <SimpleInput
          name="totalHarga"
          type="number"
          label="Total Harga"
          value={totalPrice}
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
