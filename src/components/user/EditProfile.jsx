import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import SimpleInput from "../customs/form/SimpleInput";
import BackButton from "../customs/button/BackButton";
import CustomToast from "../customs/toast/CustomToast";
import { useCustomToast } from "../../hooks/useCustomToast";
import { usePosStore } from "../../store/posStore";

export default function EditProfile() {
  const { user: userInfo, logout, updateProfileUser } = useAuthStore();
  const { updatePasswordPOS } = usePosStore();
  const [loading, setLoading] = useState(false);

  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const [disabledButton, setDisabledButton] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

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

    if (isEditPassword) {
      if (formData.password) {
        if (formData.password.length < 6) {
          newErrors.password = "Password minimal 6 karakter";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Password tidak sama";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditPassword = (e) => {
    e.preventDefault();
    setIsEditPassword(!isEditPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setDisabledButton(true);

    const passwordFields = {
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(isEditPassword && {
        ...passwordFields,
      }),
      // ...(formData.password && { password: formData.password }),
      // ...(formData.password && { password_confirmation: formData.password }),
    };

    setLoading(true);

    if (isEditPassword) {
      const [response, responsePOS] = await Promise.all([
        updateProfileUser(updateData),
        updatePasswordPOS(passwordFields),
      ]);
      if (response?.success === true && responsePOS?.success === true) {
        showSuccess("Profil Berhasil Diperbarui");
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        showError("Gagal Memperbarui Profil");
      }
    } else {
      const response = await updateProfileUser(updateData);
      sessionStorage.setItem("authUser", JSON.stringify(response?.data));
      if (response?.success === true) {
        showSuccess("Profil Berhasil Diperbarui");
        setTimeout(() => {
          navigate("/account-information");
          globalThis.location.reload();
        }, 2000);
      } else {
        showError("Gagal Memperbarui Profil");
      }
    }

    setLoading(false);
  };

  const renderElements = useMemo(() => {
    return (
      <div className="max-w-md mx-auto p-6 rounded-lg bg-white shadow mt-5">
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
          <div className="flex w-full justify-end">
            <button onClick={(e) => handleEditPassword(e)}>
              Edit Password?
            </button>
          </div>
          {isEditPassword && (
            <>
              <SimpleInput
                name="password"
                type="password"
                label="Password Baru"
                value={formData.password}
                errors={errors.password}
                handleChange={handleChange}
                disabled={!isEditPassword}
              />
              <SimpleInput
                name="confirmPassword"
                type="password"
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                errors={errors.confirmPassword}
                handleChange={handleChange}
                disabled={!isEditPassword}
              />
            </>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[var(--c-primary)] font-semibold text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={disabledButton}
            >
              {loading ? "Tunggu..." : " Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    );
  }, [formData, errors, isEditPassword, loading, disabledButton]);

  useEffect(() => {
    const hasChanged =
      formData.name !== userInfo.name ||
      formData.password !== "" ||
      formData.confirmPassword !== "";
    setDisabledButton(!hasChanged);
  }, [formData, userInfo.name]);

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      <BackButton to="/account-information" />
      {renderElements}
    </>
  );
}
