import { useState } from "react";
import { formatCurrency } from "../helper/currency";
import SimpleInput from "./form/SimpleInput";
import CustomSelectBox from "./form/CustomSelectBox";
import { useInvoiceStore } from "../store/invoiceStore";
import { useNavigate } from "react-router-dom";

const dataBarang = [
  {
    id: "BRG-001",
    name: "Susu Ultramilk",
    amount: 7000,
    qty: 2,
  },
  {
    id: "BRG-002",
    name: "Es Krim Ayce",
    amount: 15000,
    qty: 4,
  },
  {
    id: "BRG-003",
    name: "Daging Sapi 1 KG",
    amount: 120000,
    qty: 1,
  },
];

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

  const { addInvoices, isLoading, error } = useInvoiceStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const checkError = Object.keys(errors).length > 0;

    if (checkError) return;

    const response = await addInvoices(selectedData);

    console.log(response);

    if (response.ok) {
      navigate("/invoice", { replace: true });

      setSelectedData([]);
      setSelected([]);
      setErrors([]);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="customer_name"
          type="text"
          label="Nama Customer"
          value={selectedData.customer_name}
          errors={errors.customer_name}
          handleChange={handleChange}
        />
        <CustomSelectBox
          label="Pilih produk"
          name="products"
          value={selected}
          selectBoxData={dataBarang}
          onChange={(items) => {
            // items is expected to be an array of objects when multiple
            setSelected(items || []);
            // Map selected items into the products shape expected by selectedData
            const mapped = Array.isArray(items)
              ? items.map((it) => ({
                  product_name: it.name || "",
                  quantity: it.qty ?? "",
                  price: it.amount ?? "",
                }))
              : items
              ? [
                  {
                    product_name: items.name || "",
                    quantity: items.qty ?? "",
                    price: items.amount ?? "",
                  },
                ]
              : [];

            setSelectedData((prev) => ({
              ...prev,
              products: mapped,
            }));
          }}
          placeholder="Cari atau pilih..."
          multiple={true}
        />
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
          label="Tanggal Penagihan"
          value={selectedData.invoice_date}
          errors={errors.invoice_date}
          handleChange={handleChange}
        />
        <SimpleInput
          name="invoice_due_date"
          type="date"
          label="Tenggat Waktu Pembayaran"
          value={selectedData.invoice_due_date}
          errors={errors.invoice_due_date}
          handleChange={handleChange}
        />
        <SimpleInput
          name="bill_address"
          type="text"
          label="Alamat Penagihan"
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
