import { useNavigate } from "react-router-dom";
import { AlertCircle, Home, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-start justify-center mt-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-center max-w-md w-full">
        {/* 404 Icon/Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-base leading-relaxed">
          Maaf, halaman yang Anda cari tidak ditemukan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row gap-3 justify-center">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--c-primary)] hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Membutuhkan bantuan?
          </p>
          <button
            onClick={() => navigate("/customer-support")}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
          >
            Hubungi Dukungan Pelanggan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
