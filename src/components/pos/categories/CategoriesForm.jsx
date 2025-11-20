import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleInput from "../../customs/form/SimpleInput";
import CustomInputFile from "../../customs/form/CustomInputFile";
import BackButton from "../../customs/button/BackButton";
import CustomToast from "../../customs/toast/CustomToast";
import { useProductStore } from "../../../store/productStore";
import { useCustomToast } from "../../../hooks/useCustomToast";
import PrimaryButton from "../../customs/button/PrimaryButton";

export default function CategoriesForm(props) {
  const { editMode = false, categoryId = null } = props;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const {
    addCategories,
    editCategories,
    getDetailCategory,
    isLoading,
    clearError,
  } = useProductStore();

  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    const isEmptyStr = (v) =>
      v === undefined || v === null || String(v).trim() === "";

    // Basic required fields
    if (isEmptyStr(formData.name)) errors.name = "Nama kategori wajib diisi";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const normalizedImage =
      editMode && typeof formData.image === "string" ? "" : formData.image;

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const response = editMode
      ? await editCategories(
          {
            ...formData,
            image: normalizedImage,
          },
          categoryId
        )
      : await addCategories(formData);

    if (response?.success === true) {
      showSuccess(
        `${
          editMode
            ? "Kategori Berhasil Diperbarui"
            : "Kategori Berhasil Ditambahkan"
        }`
      );

      setTimeout(() => {
        navigate("/pos/products", { replace: true });
      }, 3000);
    } else {
      showError(
        `${
          editMode ? "Gagal Memperbarui Kategori" : "Gagal Menambahkan Kategori"
        }`
      );
    }
  };

  const mapDetailToForm = (category) => {
    const mappedData = {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    };
    setFormData(mappedData);
  };

  const getCategoriesForEdit = async () => {
    const res = await getDetailCategory(categoryId);

    if (res) {
      mapDetailToForm(res);
    }
  };

  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
  }, []);

  useEffect(() => {
    if (editMode && categoryId) {
      getCategoriesForEdit();
    }
  }, [editMode, categoryId]);

  const renderElements = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="name"
          type="text"
          label="Nama Kategori"
          value={formData?.name}
          handleChange={handleChange}
          isRequired={true}
          errors={validationErrors?.name}
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
          initialPreview={
            typeof formData?.image === "string" && formData.image
              ? /^https?:\/\//.test(formData.image)
                ? formData.image
                : `${import.meta.env.VITE_API_IMAGE}${formData.image}`
              : null
          }
          label="Gambar Kategori"
        />
        <PrimaryButton
          isLoading={isLoading}
          handleOnClick={handleSubmit}
          title="Simpan"
          disableCondition={isLoading}
        />
      </div>
    );
  }, [formData, handleChange]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <BackButton to="/pos/products" />
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      {renderElements}
    </div>
  );
}
