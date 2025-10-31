import { useMemo, useState, useEffect } from "react";
import SimpleInput from "./form/SimpleInput";
import CustomInputFile from "./form/CustomInputFile";
import { useProductStore } from "../store/productStore";
import { toast, ToastContainer } from "react-toastify";
import BackButton from "./BackButton";

export default function POSAddProducts() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const { addCategories, isLoading, success, error, clearError } = useProductStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => await addCategories(formData);

  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
  }, []);

  useEffect(() => {
    if (success) {
      toast.success(
        typeof success === "string" ? success : "Berhasil menambahkan kategori",
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

      return () => clearTimeout();
    }

    if (error) {
      toast.error(
        typeof error === "string"
          ? "Gagal Menambahkan Kategori"
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

  const renderElements = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="name"
          type="text"
          label="Nama Kategori"
          value={formData?.name}
          handleChange={handleChange}
          // disabled={true}
        />
        <SimpleInput
          name="description"
          type="text"
          label="Description"
          value={formData?.description}
          handleChange={handleChange}
          // disabled={true}
        />
        <CustomInputFile
          name="image"
          accept="image/*"
          onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
          initialPreview={formData?.image || null}
        />
        <button
          onClick={handleSubmit}
          className="bg-[var(--c-primary)] text-white py-4 w-full rounded-lg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Tambah Kategori"}
        </button>
      </div>
    );
  }, [formData, handleChange]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      <BackButton to="/pos/products" />
      {renderElements}
    </div>
  );
}
