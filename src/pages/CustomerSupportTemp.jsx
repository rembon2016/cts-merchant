import {
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  HelpCircle,
  Book,
  FileText,
  Ticket,
  Plus,
  List,
  Lightbulb,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCSStore } from "../store/csStore";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const CustomerSupportTemp = () => {
  const navigate = useNavigate();
  const { contactInfo, isOperational, checkOperationalStatus } = useCSStore();
  const { user } = useAuthStore();

  useEffect(() => {
    checkOperationalStatus();
  }, [checkOperationalStatus]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo, saya ${
        user?.name || "User"
      } membutuhkan bantuan terkait CTS Merchant.`
    );
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  const handlePhone = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Customer Support</h1>
        <p className="text-blue-100">
          Halo, {user?.name || "User"}! Ada yang bisa kami bantu?
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Operasional */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status Layanan
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {isOperational ? "🟢 Online" : "🔴 Offline"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Jam Operasional
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Senin - Jumat: {useCSStore.getState().operationalHours.weekdays}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sabtu - Minggu: {useCSStore.getState().operationalHours.weekend}
              </p>
            </div>
          </div>
        </div>

        {/* Kontak Cepat */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Kontak Cepat
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePhone}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-900 dark:text-blue-950" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Telepon
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {contactInfo.phone}
              </span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-900 dark:text-blue-950" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                WhatsApp
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Chat langsung
              </span>
            </button>

            <button
              onClick={() => navigate("/cs/email")}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-900 dark:text-blue-950" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Email
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {contactInfo.email}
              </span>
            </button>

            <button
              onClick={() => navigate("/cs/chat")}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-900 dark:text-blue-950" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Live Chat
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isOperational ? "Online" : "Offline"}
              </span>
            </button>
          </div>
        </div>

        {/* Pusat Bantuan */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Pusat Bantuan
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/faq")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">FAQ</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pertanyaan yang sering ditanyakan
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/cs/guide")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Panduan Penggunaan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tutorial lengkap aplikasi
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/cs/terms")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Syarat & Ketentuan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kebijakan penggunaan
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Laporan Dukungan */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Laporan Dukungan
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/cs/ticket/create")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Buat Laporan Baru
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Laporkan masalah atau pertanyaan
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/cs/tickets")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <List className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Riwayat Laporan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lihat semua Laporan Anda
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Lainnya */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Lainnya
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/cs/feedback")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Saran & Masukan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bantu kami berkembang lebih baik
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/cs/feedback")}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-900 dark:text-blue-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Beri Rating
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nilai pengalaman Anda
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportTemp;
