import { useMemo, useState, useEffect } from "react";
import SimpleInput from "./form/SimpleInput";
import CustomInputFile from "./form/CustomInputFile";
import { useProductStore } from "../store/productStore";
import { toast, ToastContainer } from "react-toastify";
import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";

export default function POSEditCategories() {
  const location = useLocation();
  const pathname = location.pathname;
  const categoryId = pathname.split("/pos/edit-kategori/")[1];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const {
    editCategories,
    getDetailCategory,
    isLoading,
    success,
    error,
    clearError,
  } = useProductStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const response = await editCategories(formData, categoryId);

    if (response?.success) {
      toast.success(
        typeof success === "string" ? success : "Berhasil mengubah kategori",
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
        navigate("/pos/products", { replace: true });
      }, 3000);
    } else {
      toast.error(
        typeof error === "string"
          ? "Gagal Mengubah Kategori"
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

  useEffect(() => {
    clearError();
    const loadDetail = async () => {
      const detail = await getDetailCategory(categoryId);
      if (detail) {
        // Normalize possible response shapes: {category: {...}} or direct object
        const data = detail?.category ?? detail;
        setFormData({
          name: data?.name || "",
          description: data?.description || "",
          image: data?.image || "",
        });
      }
    };
    loadDetail();
    return () => {
      clearError();
    };
  }, [categoryId]);

  console.log("Category ID: ", categoryId);

  const renderElements = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="name"
          type="text"
          label="Nama Kategori"
          value={formData?.name}
          handleChange={handleChange}
        />
        <SimpleInput
          name="description"
          type="text"
          label="Description"
          value={formData?.description}
          handleChange={handleChange}
        />
        <CustomInputFile
          name="image"
          accept="image/*"
          onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
          initialPreview={
            typeof formData?.image === "string" && formData.image
              ? `${import.meta.env.VITE_API_IMAGE}${formData.image}`
              : null
          }
        />
        <button
          onClick={handleSubmit}
          className="bg-[var(--c-primary)] text-white py-4 w-full rounded-lg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Simpan Perubahan"}
        </button>
      </div>
    );
  }, [formData, handleChange, isLoading]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      <BackButton to="/pos/products" />
      {renderElements}
    </div>
  );
}
