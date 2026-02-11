import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef, memo } from "react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import SimpleAlert from "../customs/alert/SimpleAlert";
import SimpleInput from "../customs/form/SimpleInput";
import CustomToast from "../customs/toast/CustomToast";
import { useCustomToast } from "../../hooks/useCustomToast";
import { useInstallPWA } from "../../hooks/useInstallPWA";
import PrimaryButton from "../customs/button/PrimaryButton";
import CustomImage from "../customs/element/CustomImage";

const AuthForm = memo(function AuthForm({ formMode = "login" }) {
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
  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const { platform, showInstallCTA, installEvent, install } = useInstallPWA();

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

  const handleInstallClick = async () => {
    try {
      const result = await install();
      if (result?.success) {
        showSuccess(
          platform === "android"
            ? "Instalasi dimulai"
            : "Buka menu Share dan pilih Add to Home Screen",
        );
        return;
      }
      if (platform === "android") {
        if (result?.outcome === "unavailable") {
          showError(
            "Fitur instalasi belum siap atau sudah terpasang. Jika tombol tidak muncul, gunakan menu browser (Add to Home Screen).",
          );
          return;
        }
        showError("Instalasi dibatalkan");
        return;
      }
      if (platform === "ios") {
        if (result?.outcome === "share_unavailable") {
          showError("Buka menu Share lalu pilih Add to Home Screen");
          return;
        }
        showError("Instalasi dibatalkan");
        return;
      }
      showError("Instalasi dibatalkan");
    } catch (e) {
      showError(
        platform === "android"
          ? "Gagal memulai instalasi"
          : "Gunakan Share → Add to Home Screen untuk memasang",
      );
    }
  };

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

    const defaultFormValue = {
      email: formData.email,
      password: formData.password,
      firebase_token: sessionStorage?.getItem("firebaseToken") || "",
    };

    try {
      if (isLoginMode) {
        const result = await login({
          ...defaultFormValue,
        });
        if (!result?.success) {
          setError(result?.error || "Gagal melakukan login");
        }
      } else {
        const payload = {
          name: formData.name,
          ...defaultFormValue,
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
          `Terjadi error saat ${isLoginMode ? "login" : "registrasi"}`,
      );
    }
  };

  const getImage = useMemo(() => {
    return isDark ? "/images/logo-cts.svg" : "/images/logo-cts-blue.svg";
  }, [isDark]);

  const getIconAndroid = useMemo(() => {
    return "/icons/icon-android.svg";
  }, []);

  const getIconIos = useMemo(() => {
    return "/icons/icon-ios.svg";
  }, []);

  // Preload critical images
  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    };

    preloadImage(getImage);
  }, [getImage]);

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col mb-6">
          <CustomImage
            imageSource={getImage}
            imageWidth={96}
            imageHeight={96}
            altImage="CTS"
            imageLoad="eager"
            imageFetchPriority="high"
            className="w-24 h-24 mx-auto"
          />
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

        <form
          className="space-y-3"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              isLoginMode &&
              e.target?.name === "password"
            ) {
              handleSubmit(e);
            }
          }}
        >
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

          <PrimaryButton
            isLoading={isLoading}
            handleOnClick={handleSubmit}
            title={isLoginMode ? "Masuk" : "Daftar"}
            disableCondition={isLoginMode ? isLoading : !checked || isLoading}
          />

          {/* <h6 className="flex justify-center gap-1">
            {isLoginMode ? "Belum Punya Akun?" : "Sudah Punya Akun?"}
            <Link
              to={isLoginMode ? "/register" : "/login"}
              className="text-blue-600 dark:text-blue-300"
            >
              {" "}
              {isLoginMode ? "Daftar" : "Masuk"}
            </Link>
          </h6> */}
          {showInstallCTA && (
            <div className="flex flex-col gap-2 mt-2">
              {platform === "android" && (
                <button
                  onClick={handleInstallClick}
                  className={
                    "w-full h-14 rounded-xl bg-black text-white flex justify-center items-center px-4 gap-3 shadow-md hover:opacity-90"
                  }
                  aria-label="Install on Android"
                  title={
                    installEvent
                      ? "Install aplikasi CTS Merchant"
                      : "Jika tombol tidak memulai install, gunakan ikon Install Chrome"
                  }
                >
                  <CustomImage
                    imageSource={getIconAndroid}
                    imageWidth={32}
                    imageHeight={48}
                    altImage="Install on Android"
                    imageLoad="eager"
                    imageFetchPriority="high"
                    className="w-8 h-12"
                  />
                  <div className="flex items-center leading-tight">
                    <span className="text-lg font-semibold">
                      Install on Android
                    </span>
                  </div>
                </button>
              )}
              {platform === "ios" && (
                <button
                  onClick={handleInstallClick}
                  className="w-full h-14 rounded-xl bg-white text-black flex items-center justify-center px-4 gap-3 shadow-md hover:opacity-90"
                  aria-label="Download on the IOS"
                  title="Lihat cara pasang di layar utama untuk iOS"
                >
                  <CustomImage
                    imageSource={getIconIos}
                    imageWidth={32}
                    imageHeight={48}
                    altImage="Install on iOS"
                    imageLoad="eager"
                    imageFetchPriority="high"
                    className="w-8 h-12"
                  />
                  <div className="flex justify-center items-center leading-tight">
                    <span className="text-lg font-semibold">
                      Install on IOS
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AuthForm.displayName = "AuthForm";

export default AuthForm;
