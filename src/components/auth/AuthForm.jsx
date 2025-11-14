import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import SimpleAlert from "../customs/alert/SimpleAlert";
import SimpleInput from "../customs/form/SimpleInput";
import CustomToast from "../customs/toast/CustomToast";
import { useCustomToast } from "../../hooks/useCustomToast";

export default function AuthForm({ formMode = "login" }) {
  const isLoginMode = formMode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [checked, setChecked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");

  const hasShownLogoutToast = useRef(false);

  const navigate = useNavigate();
  const { login, register, isLoggedIn, isLoading, isLogout } = useAuthStore();
  const { isDark } = useThemeStore();
  const { toast, success: showSuccess, hideToast } = useCustomToast();

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    }
  }, [isLoggedIn, navigate]);

  // Tampilkan toast sukses setelah logout (skenario saat user diarahkan ke halaman login)
  useEffect(() => {
    if (isLogout && !hasShownLogoutToast.current) {
      showSuccess("Anda Berhasil Keluar");
      hasShownLogoutToast.current = true;
    }
  }, [isLogout]);

  const validateForm = () => {
    const errors = {};

    if (!isLoginMode) {
      if (!formData.name) {
        errors.name = "Nama lengkap tidak boleh kosong";
      }
    }

    if (!formData.email) {
      errors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email tidak valid";
    }

    if (!formData.password) {
      errors.password = "Password tidak boleh kosong";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    if (!isLoginMode) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Password tidak cocok";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    try {
      if (isLoginMode) {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });
        if (!result?.success) {
          setError(result?.error || "Gagal melakukan login");
        }
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        };
        const result = await register(payload);
        if (!result?.success) {
          setError(result?.error || "Register failed");
        }
      }
      // Navigasi ditangani oleh useEffect saat isLoggedIn berubah
    } catch (err) {
      setError(
        err?.message ||
          (isLoginMode
            ? "Terjadi error saat login"
            : "Terjadi error saat registrasi")
      );
    }
  };

  const getImage = useMemo(() => {
    return isDark ? "/images/logo-cts.svg" : "/images/logo-cts-blue.svg";
  }, [isDark]);

  return (
    <div className="mt-8 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col mb-6">
          <img src={getImage} alt="CTS" className="w-24 h-24 mx-auto" />
          <h3 className="font-bold text-4xl text-center">Merchant</h3>
        </div>

        <SimpleAlert
          type={error ? "error" : null}
          textContent={error || null}
        />
        <CustomToast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={toast.duration}
        />

        <div className="flex flex-col gap-1 my-8">
          <h2 className="text-2xl font-bold text-start">
            {isLoginMode ? "Masuk" : "Daftar"}
          </h2>
          <p className="text-slate-600 text-base">
            {isLoginMode ? "Masuk ke CTS Merchant" : "Buat akun CTS Merchant"}
          </p>
        </div>

        <form className="space-y-3">
          {!isLoginMode && (
            <SimpleInput
              name="name"
              type="text"
              label="Nama Lengkap"
              value={formData.name}
              handleChange={handleChange}
              errors={validationErrors.name}
            />
          )}

          <SimpleInput
            name="email"
            type="text"
            label={isLoginMode ? "Username / Email" : "Email"}
            value={formData.email}
            handleChange={handleChange}
            errors={validationErrors.email}
          />

          <SimpleInput
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            handleChange={handleChange}
            errors={validationErrors.password}
            changeInputType={true}
          />

          {!isLoginMode && (
            <SimpleInput
              name="confirmPassword"
              type="password"
              label="Konfirmasi Password"
              value={formData.confirmPassword}
              handleChange={handleChange}
              errors={validationErrors.confirmPassword}
              changeInputType={true}
            />
          )}
        </form>

        <div className="mt-6 flex flex-col gap-3">
          {!isLoginMode && (
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 leading-tight"
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className="text-sm ">
                Saya setuju dengan{" "}
                <Link to="#" className="text-blue-600 dark:text-blue-300">
                  Syarat dan Ketentuan
                </Link>
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            onClick={handleSubmit}
            disabled={isLoginMode ? isLoading : !checked || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Tunggu...
              </div>
            ) : isLoginMode ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </button>

          <h6 className="flex justify-center gap-1">
            {isLoginMode ? "Belum Punya Akun?" : "Sudah Punya Akun?"}
            <Link
              to={isLoginMode ? "/register" : "/login"}
              className="text-blue-600 dark:text-blue-300"
            >
              {" "}
              {isLoginMode ? "Daftar" : "Masuk"}
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}
