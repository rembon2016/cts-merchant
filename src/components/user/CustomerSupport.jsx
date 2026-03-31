import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { useCSStore } from "../../store/csStore";

export default function CustomerSupport() {
  const navigate = useNavigate();
  const { csTeams } = useCSStore();

  const handleWhatsAppRedirect = (teamKey, phoneNumber, issueFocus) => {
    const message = `Halo, saya membutuhkan bantuan ${issueFocus} untuk tim ${teamKey}.`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const teams = Object.values(csTeams);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Customer Support
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Silakan pilih tim customer service sesuai jenis kendala Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => (
            <div
              key={team.key}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-slate-100 dark:border-slate-700"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {team.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Hubungi untuk {team.issueFocus}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Jam Operasional: Senin - Jumat {team.operationalHours.weekdays}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleWhatsAppRedirect(
                      team.title,
                      team.contactInfo.whatsapp,
                      team.issueFocus,
                    )
                  }
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  WhatsApp
                </button>

                <button
                  onClick={() => handleCall(team.contactInfo.phone)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt className="w-4 h-4" />
                  Telepon ({team.contactInfo.phone})
                </button>

                <button
                  onClick={() => handleEmail(team.contactInfo.email)}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                  <FaEnvelope className="w-4 h-4" />
                  Email ({team.contactInfo.email})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5">
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Kembali ke Beranda
          </button>
        </div> */}
      </div>
    </div>
  );
}
