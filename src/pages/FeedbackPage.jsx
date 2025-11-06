import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FeedbackForm from "../components/cs/FeedbackForm";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/customer-support");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Saran & Masukan
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {!showSuccess ? (
          <>
            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Masukan Anda sangat berharga untuk membantu kami meningkatkan
                kualitas aplikasi. Terima kasih atas dukungan Anda!
              </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <FeedbackForm onSuccess={handleSuccess} />
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Terima Kasih!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Masukan Anda telah berhasil dikirim.
              <br />
              Kami akan segera meresponnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
