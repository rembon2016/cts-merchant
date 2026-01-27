import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function CustomerSupport() {
  const navigate = useNavigate();

  const handleWhatsAppRedirect = () => {
    // Ganti nomor WhatsApp sesuai kebutuhan (format: 62xxxxxxxxxx tanpa +)
    const phoneNumber = "6281262989888"; // Contoh nomor WhatsApp
    const message = "Halo, saya membutuhkan bantuan customer support.";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full mt-10 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        {/* WhatsApp Icon */}
        <div className="mb-8">
          <FaWhatsapp className="w-24 h-24 mx-auto text-green-500" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300 mb-4">
          Customer Support
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Hubungi kami melalui WhatsApp untuk bantuan lebih lanjut
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppRedirect}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaWhatsapp className="w-5 h-5" />
            Hubungi WhatsApp
          </button>

          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
