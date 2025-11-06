import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "react-toastify";
import { usePPOBProductStore } from "../../store/ppobProductStore";
import { usePPOBStore } from "../../store/ppobStore";
import ConfirmationModal from "../../components/ppob/ConfirmationModal";
import ProcessingModal from "../../components/ppob/ProcessingModal";

const PPOBBPJS = () => {
  const navigate = useNavigate();
  const { getMockCustomer } = usePPOBProductStore();
  const { balance } = usePPOBStore();

  const [cardNumber, setCardNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 13) {
      setCardNumber(value);
      setCustomerData(null);
    }
  };

  const handleCheckBill = () => {
    if (!cardNumber || cardNumber.length < 13) return;

    const mockData = getMockCustomer("bpjs", cardNumber);
    if (mockData) {
      setCustomerData(mockData);
    } else {
      toast.error("Data peserta BPJS tidak ditemukan", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleContinue = () => {
    if (!customerData) return;
    const totalAmount = customerData.bill + customerData.adminFee;
    if (balance < totalAmount) {
      toast.error("Saldo PPOB tidak mencukupi!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowProcessModal(true);
  };

  const handleProcessComplete = () => {
    setShowProcessModal(false);
    navigate("/ppob/history");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/ppob")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              BPJS Kesehatan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bayar iuran BPJS Kesehatan
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">💡 Info:</span> Masukkan nomor kartu
            BPJS Kesehatan 13 digit untuk melihat detail tagihan iuran.
          </p>
        </div>

        {/* Card Number Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Nomor Kartu BPJS Kesehatan
          </label>
          <div className="space-y-3">
            <input
              type="tel"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0001234567890"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              onClick={handleCheckBill}
              disabled={!cardNumber || cardNumber.length < 13}
              className="w-full py-3 bg-[var(--c-primary)] hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Cek Tagihan
            </button>
          </div>
        </div>

        {/* Customer Data Display */}
        {customerData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Detail Peserta
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nomor Kartu
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {cardNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nama Peserta
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customerData.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Jumlah Anggota
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customerData.familyMembers} orang
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kelas</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Kelas {customerData.class}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Iuran per Bulan
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Rp. {customerData.monthlyFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Periode
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customerData.period}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Tagihan
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Rp. {customerData.bill.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Biaya Admin
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Rp. {customerData.adminFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <span className="text-gray-900 dark:text-white">
                    Total Bayar
                  </span>
                  <span className="text-[var(--c-primary)] dark:text-blue-400">
                    Rp.{" "}
                    {(customerData.bill + customerData.adminFee).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {customerData && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[var(--c-primary)] hover:opacity-90 text-white font-semibold rounded-lg transition-colors"
            >
              Bayar Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showConfirmModal && customerData && (
        <ConfirmationModal
          type="bpjs"
          data={{
            product: `Iuran BPJS Kesehatan ${customerData.period}`,
            target: cardNumber,
            customerName: customerData.name,
            amount: customerData.bill + customerData.adminFee,
            details: `Kelas ${customerData.class} - ${customerData.familyMembers} anggota`,
          }}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showProcessModal && customerData && (
        <ProcessingModal
          type="bpjs"
          data={{
            product: `Iuran BPJS Kesehatan ${customerData.period}`,
            target: cardNumber,
            customerName: customerData.name,
            amount: customerData.bill + customerData.adminFee,
          }}
          onComplete={handleProcessComplete}
        />
      )}
    </div>
  );
};

export default PPOBBPJS;
