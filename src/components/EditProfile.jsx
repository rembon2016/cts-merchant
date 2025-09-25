import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import useFetchDataStore from "../store/fetchDataStore";
import SimpleAlert from "./alert/SimpleAlert";
import SimpleInput from "./form/SimpleInput";

export default function EditProfile() {
  const { user: userInfo, logout } = useAuthStore();
  const { loading, success, error, fetchData } = useFetchDataStore();
  const [disabledButton, setDisabledButton] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama Lengkap harus diisi";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Password tidak sama";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      ...(formData.password && { password_confirmation: formData.password }),
    };

    fetchData(`${import.meta.env.VITE_API_ROUTES}/v1/user/update`, {
      method: "POST",
      headers: headersApi,
      body: JSON.stringify(updateData),
    });
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => logout(), [1000]);
    }
  }, [success]);

  useEffect(() => {
    const hasChanged =
      formData.name !== userInfo.name ||
      formData.password !== "" ||
      formData.confirmPassword !== "";
    setDisabledButton(!hasChanged);
  }, [formData, userInfo.name]);

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-white shadow mt-5">
      <SimpleAlert
        type={success ? "success" : error ? "error" : null}
        textContent={
          success
            ? "Profil berhasil diubah"
            : error
            ? "Profil gagal diubah"
            : null
        }
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-slate-400">
          Edit Profil
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-600 hover:text-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SimpleInput
          name="name"
          type="text"
          label="Nama Lengkap"
          value={formData.name}
          errors={errors.name}
          handleChange={handleChange}
        />
        <SimpleInput
          name="password"
          type="password"
          label="Password Baru"
          value={formData.password}
          errors={errors.password}
          handleChange={handleChange}
        />
        <SimpleInput
          name="confirmPassword"
          type="password"
          label="Konfirmasi Password"
          value={formData.confirmPassword}
          errors={errors.confirmPassword}
          handleChange={handleChange}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[var(--c-primary)] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            disabled={disabledButton}
          >
            {loading ? "Tunggu..." : " Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
