import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const OPTIONS = [
  { value: true, label: "Sudah di edukasi" },
  { value: false, label: "Belum di edukasi" },
];

export default function CourierEducationModal() {
  const { showCourierEducationPopup, submitCourierEducation } = useAuthStore();
  const [selected, setSelected] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showCourierEducationPopup) return null;

  const handleConfirm = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    const result = await submitCourierEducation(selected);

    if (!result.success) {
      setSubmitError(result.error || "Gagal menyimpan jawaban. Silakan coba lagi.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Non-clickable overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60" />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm mx-8 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,47,108,0.08)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Edukasi oleh Kurir
          </h2>
          <p className="text-sm text-gray-500">
            Apakah Anda sudah diedukasi oleh kurir mengenai penggunaan aplikasi ini?
          </p>
        </div>

        {/* Radio Toggle Options */}
        <div className="flex flex-col gap-2">
          {OPTIONS.map((option) => {
            const isActive = selected === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                disabled={isSubmitting}
                onClick={() => setSelected(option.value)}
                className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-primary bg-[rgba(0,47,108,0.06)] text-primary"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Radio indicator */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isActive ? "border-primary" : "border-gray-300"
                  }`}
                >
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Error message */}
        {submitError && (
          <p className="text-xs text-red-500 text-center -mt-2">{submitError}</p>
        )}

        {/* Confirm Button */}
        <button
          type="button"
          disabled={selected === null || isSubmitting}
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-[#003d8f] active:bg-[#002560] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
        </button>
      </div>
    </div>
  );
}
