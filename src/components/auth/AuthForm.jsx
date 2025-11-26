import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import SimpleAlert from "../customs/alert/SimpleAlert";
import SimpleInput from "../customs/form/SimpleInput";
import CustomToast from "../customs/toast/CustomToast";
import { useCustomToast } from "../../hooks/useCustomToast";
import PrimaryButton from "../customs/button/PrimaryButton";
import SimpleModal from "../customs/modal/SimpleModal";
import { Apple } from "lucide-react";

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
  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const [installEvent, setInstallEvent] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState("web");
  const [showInstallModal, setShowInstallModal] = useState(false);

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

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      setPlatform("android");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsStandalone(!!standalone);

    const ua = (window.navigator.userAgent || "").toLowerCase();
    const isSafari =
      ua.includes("safari") &&
      !ua.includes("chrome") &&
      !ua.includes("crios") &&
      !ua.includes("fxios");
    const isChromium =
      ua.includes("chrome") ||
      ua.includes("crios") ||
      ua.includes("edg") ||
      ua.includes("opr") ||
      ua.includes("samsungbrowser");

    if (isSafari) {
      setPlatform("ios");
    } else if (isChromium) {
      setPlatform("android");
    } else {
      setPlatform("android");
    }

    const onInstalled = () => {
      setIsStandalone(true);
      setInstallEvent(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const showInstallCTA = useMemo(() => {
    return !isStandalone;
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (platform === "android" && installEvent) {
      try {
        installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice?.outcome === "accepted") {
          showSuccess("Instalasi dimulai");
          setInstallEvent(null);
        } else {
          showError("Instalasi dibatalkan");
        }
      } catch (e) {
        showError("Gagal memulai instalasi");
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const installHelpText = useMemo(() => {
    if (platform === "ios") {
      return "Pada perangkat iOS (Safari), ketuk ikon Share lalu pilih Add to Home Screen untuk memasang CTS Merchant.";
    }
    return "Di Google Chrome/Chromium, klik ikon Install di address bar atau pilih Install app dari menu untuk memasang CTS Merchant.";
  }, [platform]);

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
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="gp1" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#00A0FF" />
                        <stop offset="100%" stopColor="#00E3FF" />
                      </linearGradient>
                      <linearGradient id="gp2" x1="0" x2="1" y1="1" y2="0">
                        <stop offset="0%" stopColor="#FFE000" />
                        <stop offset="100%" stopColor="#FF9C00" />
                      </linearGradient>
                      <linearGradient id="gp3" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#FF3A44" />
                        <stop offset="100%" stopColor="#C31162" />
                      </linearGradient>
                      <linearGradient id="gp4" x1="0" x2="1" y1="1" y2="0">
                        <stop offset="0%" stopColor="#32A071" />
                        <stop offset="100%" stopColor="#00D38C" />
                      </linearGradient>
                    </defs>
                    <path d="M47 86l228 170L47 426z" fill="url(#gp1)" />
                    <path
                      d="M474 256L275 171 208 220l67 49 199-13z"
                      fill="url(#gp2)"
                    />
                    <path
                      d="M474 256L275 341 208 292l67-49 199 13z"
                      fill="url(#gp3)"
                    />
                    <path d="M47 86l228 170-67 49L47 86z" fill="url(#gp4)" />
                  </svg>
                  <div className="flex items-center leading-tight">
                    <span className="text-lg font-semibold">
                      Install On Android
                    </span>
                  </div>
                </button>
              )}
              {platform === "ios" && (
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="w-full h-14 rounded-xl bg-black text-white flex items-center px-4 gap-3 shadow-md hover:opacity-90"
                  aria-label="Download on the App Store"
                  title="Lihat cara pasang di layar utama untuk iOS"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Apple className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-lg font-semibold">
                      Install On IOS
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
        {showInstallModal && (
          <SimpleModal
            onClose={() => setShowInstallModal(false)}
            title="Pasang Aplikasi"
            content={installHelpText}
          />
        )}
      </div>
    </div>
  );
}
