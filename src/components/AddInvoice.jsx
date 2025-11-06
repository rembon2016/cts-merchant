import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../helper/currency";
import SimpleInput from "./form/SimpleInput";
import { useInvoiceStore } from "../store/invoiceStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddInvoice = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const validateStep1 = () => {
    const validateErrors = {};

    if (!selectedData.customer_name) {
      validateErrors.customer_name = "Nama Customer wajib di isi";
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

  const validateStep2 = () => {
    const validateErrors = {};

    if (selectedData.products.length === 0) {
      validateErrors.products = "Minimal harus ada 1 produk";
      return validateErrors;
    }

    const hasEmptyProduct = selectedData.products.some(
      (product) => !product.product_name || !product.quantity || !product.price
    );

    if (hasEmptyProduct) {
      validateErrors.products = "Semua field produk wajib di isi";
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

  const handleProductChange = (index, field, value) => {
    setSelectedData((prev) => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
      };
      return {
        ...prev,
        products: newProducts,
      };
    });

    if (errors.products) {
      setErrors((prev) => ({
        ...prev,
        products: "",
      }));
    }
  };

  const handleNext = () => {
    let checkErrors = {};

    if (currentStep === 1) {
      checkErrors = validateStep1();
    } else if (currentStep === 2) {
      checkErrors = validateStep2();
    }

    if (Object.keys(checkErrors).length > 0) {
      setErrors(checkErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const checkErrors = validateStep2();

    if (Object.keys(checkErrors).length > 0) {
      setErrors(checkErrors);
      return;
    }

    setErrors({});
    const response = await addInvoices(selectedData);

    if (response?.success) {
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

      setSelectedData({
        customer_name: "",
        products: [{ product_name: "", quantity: "", price: "" }],
        invoice_date: "",
        invoice_due_date: "",
        bill_address: "",
      });
      setCurrentStep(1);
      setErrors({});
    } else {
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
  };

  const handleRemoveItem = (index) => {
    setSelectedData((prev) => {
      const newProducts = prev.products.filter((_, i) => i !== index);
      return { ...prev, products: newProducts };
    });
  };

  const handleAddProduct = () => {
    setSelectedData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { product_name: "", quantity: "", price: "" },
      ],
    }));
  };

  const calculateTotal = () => {
    return selectedData.products.reduce((total, product) => {
      const quantity = parseFloat(product.quantity) || 0;
      const price = parseFloat(product.price) || 0;
      return total + quantity * price;
    }, 0);
  };

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6 px-2 step-box-group">
      {[
        { num: 1, label: "Customer" },
        { num: 2, label: "Produk" },
        { num: 3, label: "Preview" },
      ].map((step, idx) => (
        <div
          key={step.num}
          className={
            "flex items-center flex-1 step-box" +
            (currentStep >= step.num ? " active" : "")
          }
        >
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentStep >= step.num
                  ? "bg-[var(--c-primary)] text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-xs mt-1 font-semibold ${
                currentStep >= step.num
                  ? "text-[var(--c-primary)]"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* {idx < 2 && (
            <div
              className={`h-1 flex-1 mx-2 transition-colors ${
                currentStep > step.num ? "bg-[var(--c-primary)]" : "bg-gray-300"
              }`}
            />
          )} */}
        </div>
      ))}
    </div>
  );

  // Step 1: Customer Information
  const renderStep1 = () => (
    <div className="flex flex-col gap-3">
      <SimpleInput
        name="customer_name"
        type="text"
        label="Nama Customer *"
        value={selectedData.customer_name}
        errors={errors.customer_name}
        handleChange={handleChange}
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
    </div>
  );

  // Step 2: Products
  const renderStep2 = () => (
    <div className="flex flex-col gap-3">
      <button
        className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg w-fit ml-auto"
        onClick={handleAddProduct}
      >
        + Tambah
      </button>
      {errors.products && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {errors.products}
        </div>
      )}
      {selectedData.products.map((item, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <SimpleInput
                name={`product_name_${index}`}
                type="text"
                label="Nama Produk *"
                value={item.product_name}
                errors=""
                handleChange={(e) =>
                  handleProductChange(index, "product_name", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <SimpleInput
                name={`quantity_${index}`}
                type="number"
                label="Jumlah *"
                value={item.quantity}
                errors=""
                handleChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <SimpleInput
                name={`price_${index}`}
                type="number"
                label="Harga *"
                value={item.price}
                errors=""
                handleChange={(e) =>
                  handleProductChange(index, "price", e.target.value)
                }
              />
            </div>
          </div>
          {selectedData.products.length > 1 && (
            <button
              className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto"
              onClick={() => handleRemoveItem(index)}
            >
              {getTrashIcon}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // Step 3: Preview
  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3">Data Customer</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Nama Customer</span>
            <span className="font-semibold">{selectedData.customer_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Alamat</span>
            <span className="font-semibold text-right">
              {selectedData.bill_address}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tanggal Penagihan</span>
            <span className="font-semibold">{selectedData.invoice_date}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Jatuh Tempo</span>
            <span className="font-semibold">
              {selectedData.invoice_due_date}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3">Daftar Produk</h3>
        <div className="flex flex-col gap-3">
          {selectedData.products.map((product, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0">
              <div className="font-semibold mb-2">{product.product_name}</div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {product.quantity} x{" "}
                  {formatCurrency(parseFloat(product.price) || 0)}
                </span>
                <span className="font-semibold text-black">
                  {formatCurrency(
                    (parseFloat(product.quantity) || 0) *
                      (parseFloat(product.price) || 0)
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t-2 flex justify-between items-center">
          <span className="font-bold text-lg">Total Tagihan</span>
          <span className="font-bold text-xl text-[var(--c-primary)]">
            {formatCurrency(calculateTotal())}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col gap-4">
        <StepIndicator />

        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex gap-3 mt-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white rounded-lg py-4 px-6 font-semibold flex-1 hover:bg-gray-600 transition-colors ease-linear duration-300"
            >
              Kembali
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="bg-[var(--c-primary)] text-white rounded-lg py-4 px-6 font-semibold flex-1 hover:bg-blue-700 transition-colors ease-linear duration-300"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-[var(--c-primary)] text-white rounded-lg py-4 px-6 font-semibold flex-1 hover:bg-blue-700 transition-colors ease-linear duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Simpan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;
