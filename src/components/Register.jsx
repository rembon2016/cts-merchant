import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import SimpleAlert from "./alert/SimpleAlert";

export default function Register() {
  const { register, isLoading } = useAuthStore();
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }

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

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col gap-3 mb-6">
          <img
            src="/public/images/logo-cts.png"
            alt="logo"
            className="w-24 h-24 mx-auto"
          />
          <h3 className="font-bold text-4xl text-center">Merchant</h3>
        </div>
        <div className="flex flex-col gap-1 my-8">
          <h2 className="text-2xl font-bold text-start">Daftar</h2>
          <p className="text-slate-600 text-base">Buat akun CTS Merchant</p>
        </div>
        <SimpleAlert
          type={error ? "error" : null}
          textContent={error || null}
        />
        <form className="space-y-2">
          <div>
            <label className="block text-sm font-medium  mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium  mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username atau email"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium  mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.password}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium  mb-1"
              htmlFor="confirmPassword"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
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
              <Link to="#" className="text-blue-600">
                Syarat dan Ketentuan
              </Link>
            </span>
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            onClick={handleSubmit}
            disabled={!checked}
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
            <Link to="/login" className="text-blue-600">
              {" "}
              Masuk
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}

// 1. misalnya merchant daftar dengan email bambang@rembon.com
// 2. connect ke api pos login dengan kredensial api_bambang@rembon.com dengan password 123456789
// 3. simpan token di application storage
// 4. setiap mau konek kedalam api pos maka headernya pake dari generated pos login token
