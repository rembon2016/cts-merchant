import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import SimpleAlert from "./alert/SimpleAlert";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, isLoggedIn, isLoading, isLogout } = useAuthStore();

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

  return (
    <div className="mt-10 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col gap-3 mb-6">
          <img
            src="/images/logo-cts.png"
            alt="deskripsi"
            className="w-24 h-24 mx-auto"
          />
          <h3 className="font-bold text-4xl text-center">Merchant</h3>
        </div>
        <div className="flex flex-col gap-1 my-8">
          <h2 className="text-2xl font-bold text-start">Masuk</h2>
          <p className="text-slate-600 text-base">Masuk ke CTS Merchant</p>
        </div>
        <SimpleAlert
          type={error ? "error" : null}
          textContent={error || null}
        />
        {isLogout && (
          <SimpleAlert type="success" textContent="Anda Berhasil Keluar" />
        )}
        <form className="space-y-2">
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
              className="w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-800"
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
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-800"
              placeholder="Masukkan password"
              onChange={handleChange}
              value={formData?.password}
            />
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
          {/* <h6 className="flex justify-center gap-1">
            Belum Punya Akun?
            <Link to="/register" className="text-blue-600">
              {" "}
              Daftar
            </Link>
          </h6> */}
        </div>
      </div>
    </div>
  );
}
