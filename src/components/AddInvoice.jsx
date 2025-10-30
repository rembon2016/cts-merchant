import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../helper/currency";
import SimpleInput from "./form/SimpleInput";
import { useInvoiceStore } from "../store/invoiceStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AddInvoice = () => {
  const [selected, setSelected] = useState([]);
  const [selectedData, setSelectedData] = useState({
    customer_name: "",
    products: [
      {
        product_name: "",
        quantity: "",
        price: "",
      },
    ],
    invoice_date: "",
    invoice_due_date: "",
    bill_address: "",
  });
  const [errors, setErrors] = useState({});

  const { addInvoices, isLoading, error, success } = useInvoiceStore();

  const getTrashIcon = useMemo(() => {
    return (
      <svg
        width="17"
        height="20"
        viewBox="0 0 17 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.25 6.75L13.41 15.148C13.283 16.421 13.22 17.057 12.93 17.538C12.6757 17.9614 12.3016 18.3 11.855 18.511C11.348 18.75 10.71 18.75 9.43 18.75H7.07C5.791 18.75 5.152 18.75 4.645 18.51C4.19805 18.2991 3.82361 17.9606 3.569 17.537C3.281 17.057 3.217 16.421 3.089 15.148L2.25 6.75M9.75 13.25V8.25M6.75 13.25V8.25M0.75 4.25H5.365M5.365 4.25L5.751 1.578C5.863 1.092 6.267 0.75 6.731 0.75H9.769C10.233 0.75 10.636 1.092 10.749 1.578L11.135 4.25M5.365 4.25H11.135M11.135 4.25H15.75"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }, []);

  const navigate = useNavigate();

  const validateForm = () => {
    const validateErrors = {};

    if (!selectedData.customer_name) {
      validateErrors.customer_name = "Nama Customer wajib di isi";
    }

    if (!selectedData.products) {
      validateErrors.products = "Products wajib di pilih";
    }

    if (!selectedData.invoice_date) {
      validateErrors.invoice_date = "Tanggal Penagihan wajib di isi";
    }

    if (!selectedData.invoice_due_date) {
      validateErrors.invoice_due_date = "Tenggat Waktu Pembayaran wajib di isi";
    }

    if (!selectedData.bill_address) {
      validateErrors.bill_address = "Alamat Penagihan wajib di isi";
    }

    return validateErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const checkErrors = validateForm();

    if (Object.keys(checkErrors).length > 0) {
      setErrors(checkErrors);
      return;
    }

    setErrors({});

    await addInvoices(selectedData);
  };

  const handleRemoveItem = (arrayName, index) => {
    setSelectedData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);
      const updates = { [arrayName]: newArray };
      return { ...prev, ...updates };
    });
  };

  useEffect(() => {
    if (success) {
      toast.success(
        typeof success === "string" ? success : "Invoices Berhasil Dibuat",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );

      setTimeout(() => {
        navigate("/invoice", { replace: true });
      }, 3000);

      setSelectedData([]);
      setSelected([]);
      setErrors([]);
    }

    if (error) {
      toast.error(
        typeof error === "string"
          ? "Terjadi Kesalahan Saat Membuat Invoices"
          : "Terjadi kesalahan",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }, [success, error]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <ToastContainer />
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="customer_name"
          type="text"
          label="Nama Customer *"
          value={selectedData.customer_name}
          errors={errors.customer_name}
          handleChange={handleChange}
        />

        <div className="flex flex-col gap-2">
          <button
            className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg w-fit ml-auto mb-3"
            onClick={() => {
              setSelectedData((prev) => ({
                ...prev,
                products: [
                  ...prev.products,
                  { product_name: "", quantity: "", price: "" },
                ],
              }));
            }}
          >
            + Tambah
          </button>
          {selectedData?.products.map((item, index) => (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2" key={index}>
                <SimpleInput
                  name="products"
                  type="text"
                  label="Nama Produk *"
                  value={item.product_name}
                  errors={errors.products}
                  handleChange={handleChange}
                />
                <SimpleInput
                  name="stock"
                  type="text"
                  label="JUmlah *"
                  value={item.quantity}
                  errors={errors.products}
                  handleChange={handleChange}
                />
                <SimpleInput
                  name="stock"
                  type="text"
                  label="Harga *"
                  value={item.price}
                  errors={errors.products}
                  handleChange={handleChange}
                />
              </div>
              <button
                className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto mt-2"
                onClick={() => handleRemoveItem("products", index)}
              >
                {getTrashIcon}
              </button>
            </div>
          ))}
        </div>
        <SimpleInput
          name="totalTagihan"
          type="text"
          label="Total Tagihan"
          value={formatCurrency(
            selected?.reduce((a, b) => a + b.amount * b.qty, 0) || 0
          )}
          disabled={true}
        />
        <SimpleInput
          name="invoice_date"
          type="date"
          label="Tanggal Penagihan *"
          value={selectedData.invoice_date}
          errors={errors.invoice_date}
          handleChange={handleChange}
        />
        <SimpleInput
          name="invoice_due_date"
          type="date"
          label="Tenggat Waktu Pembayaran *"
          value={selectedData.invoice_due_date}
          errors={errors.invoice_due_date}
          handleChange={handleChange}
        />
        <SimpleInput
          name="bill_address"
          type="text"
          label="Alamat Penagihan *"
          value={selectedData.bill_address}
          errors={errors.bill_address}
          handleChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-[var(--c-primary)] text-white rounded-lg py-4 font-semibold mt-3 hover:bg-blue-700 transition-colors ease-linear duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Simpan"}
        </button>
      </div>
    </div>
  );
};

export default AddInvoice;
