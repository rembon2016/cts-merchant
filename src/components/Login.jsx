import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import SimpleAlert from "./alert/SimpleAlert";
import { useThemeStore } from "../store/themeStore";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [changeType, setChangeType] = useState(false);

  const navigate = useNavigate();
  const { login, isLoggedIn, isLoading, isLogout } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    }
  }, [isLoggedIn, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      const result = await login(formData);

      if (!result.success) {
        setError(result.error || "Login failed");
      }
      // Navigation is handled by useEffect when isLoggedIn changes
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  const inputClassName =
    "w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200";

  const showPasswordClassName =
    "text-sm border-none outline-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300";

  const getImage = useMemo(() => {
    if (isDark) {
      return "/images/logo-cts.svg";
    } else {
      return "/images/logo-cts-blue.svg";
    }
  }, [isDark]);

  return (
    <div className="mt-10 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col mb-6">
          <img src={getImage} alt="deskripsi" className="w-24 h-24 mx-auto" />
          <h3 className="font-bold text-4xl text-center">Merchant</h3>
        </div>
        <SimpleAlert
          type={error ? "error" : null}
          textContent={error || null}
        />
        {isLogout && (
          <SimpleAlert type="success" textContent="Anda Berhasil Keluar" />
        )}
        <div className="flex flex-col gap-1 my-8">
          <h2 className="text-2xl font-bold text-start">Masuk</h2>
          <p className="text-slate-600 text-base">Masuk ke CTS Merchant</p>
        </div>
        <form className="space-y-3">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="username"
            >
              Username / Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={inputClassName}
              placeholder="Masukkan username atau email"
              onChange={handleChange}
              value={formData?.email}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={changeType ? "text" : "password"}
                id="password"
                name="password"
                className={inputClassName}
                placeholder="Masukkan password"
                onChange={handleChange}
                value={formData?.password}
              />
              <button
                className={showPasswordClassName}
                onClick={(e) => {
                  e.preventDefault();
                  setChangeType(!changeType);
                }}
              >
                show
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.password}
              </p>
            )}
          </div>
        </form>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="submit"
            className="w-full py-4 bg-[var(--c-primary)] text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Tunggu...
              </div>
            ) : (
              "Masuk"
            )}
          </button>
          <h6 className="flex justify-center gap-1">
            Belum Punya Akun?
            <Link to="/register" className="text-blue-600 dark:text-blue-300">
              {" "}
              Daftar
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}
