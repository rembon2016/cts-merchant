import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import SimpleAlert from "./alert/SimpleAlert";
import { useThemeStore } from "../store/themeStore";
import SimpleInput from "./form/SimpleInput";

export default function Register() {
  const { register, isLoading, isLoggedIn } = useAuthStore();
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [checked, setChecked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [changeType, setChangeType] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    }
  }, [isLoggedIn, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Nama lengkap tidak boleh kosong";
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

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
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
      const formatFormData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };

      const result = await register(formatFormData);

      if (!result.success) {
        setError(result.error || "Register failed");
      }
      // Navigation is handled by useEffect when isLoggedIn changes
      // navigate("/register", { replace: true });
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  const handleChangeType = (e, name) => {
    e.preventDefault();
    setChangeType((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const getImage = useMemo(() => {
    if (isDark) {
      return "/images/logo-cts.svg";
    } else {
      return "/images/logo-cts-blue.svg";
    }
  }, [isDark]);

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col mb-6">
          <img src={getImage} alt="deskripsi" className="w-24 h-24 mx-auto" />
          <h3 className="font-bold text-4xl text-center">Merchant</h3>
        </div>
        <SimpleAlert
          type={error ? "error" : null}
          textContent={error || null}
        />
        <div className="flex flex-col gap-1 my-8">
          <h2 className="text-2xl font-bold text-start">Daftar</h2>
          <p className="text-slate-600 text-base">Buat akun CTS Merchant</p>
        </div>
        <form className="space-y-3">
          <SimpleInput
            name="name"
            type="text"
            label="Nama Lengkap"
            value={formData?.name}
            handleChange={handleChange}
            errors={validationErrors.name}
          />
          <SimpleInput
            name="email"
            type="text"
            label="Email"
            value={formData?.email}
            handleChange={handleChange}
            errors={validationErrors.email}
          />
          <SimpleInput
            name="password"
            type="password"
            label="Password"
            value={formData?.password}
            handleChange={handleChange}
            errors={validationErrors.password}
            changeInputType={true}
          />
          <SimpleInput
            name="confirmPassword"
            type="password"
            label="Konfirmasi Password"
            value={formData?.confirmPassword}
            handleChange={handleChange}
            errors={validationErrors.confirmPassword}
            changeInputType={true}
          />
        </form>
        <div className="mt-6 flex flex-col gap-3">
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
          <button
            type="submit"
            className="w-full p-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            onClick={handleSubmit}
            disabled={!checked || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Tunggu...
              </div>
            ) : (
              "Daftar"
            )}
          </button>
          <h6 className="flex justify-center gap-1">
            Sudah Punya Akun?
            <Link to="/login" className="text-blue-600 dark:text-blue-300">
              {" "}
              Masuk
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}
