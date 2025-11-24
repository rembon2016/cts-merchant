import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { usePPOBStore } from "../../store/ppobStore";
import ConfirmationModal from "../../components/ppob/ConfirmationModal";
import ProcessingModal from "../../components/ppob/ProcessingModal";

const PPOBWithdraw = () => {
  const navigate = useNavigate();
  const { balance } = usePPOBStore();

  const [withdrawType, setWithdrawType] = useState("main"); // 'main' or 'bank'
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);

  const adminFee = 2500;
  const quickAmounts = [50000, 100000, 250000, 500000, 1000000, 2000000];

  const banks = [
    {
      id: "bca",
      name: "BCA",
      accountNumber: "1234567890",
      accountName: "Demo User",
    },
    {
      id: "mandiri",
      name: "Mandiri",
      accountNumber: "0987654321",
      accountName: "Demo User",
    },
    {
      id: "bni",
      name: "BNI",
      accountNumber: "5556667778",
      accountName: "Demo User",
    },
    {
      id: "bri",
      name: "BRI",
      accountNumber: "1112223334",
      accountName: "Demo User",
    },
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    const withdrawAmount = parseInt(amount);
    if (!withdrawAmount || withdrawAmount < 10000) {
      toast.warning("Minimal penarikan Rp 10.000", {
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
    if (withdrawAmount > balance) {
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
    if (withdrawType === "bank" && !selectedBank) {
      toast.warning("Pilih rekening tujuan!", {
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
    navigate("/ppob");
  };

  const withdrawAmount = parseInt(amount) || 0;
  const totalFee = withdrawType === "bank" ? adminFee : 0;
  const receivedAmount = withdrawAmount - totalFee;

  const selectedBankData = banks.find((b) => b.id === selectedBank);

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
              Tarik Saldo
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transfer saldo PPOB
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Saldo PPOB Tersedia</p>
          <h2 className="text-2xl font-bold mt-1">
            Rp. {balance.toLocaleString("id-ID")}
          </h2>
        </div>

        {/* Withdraw Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Tujuan Penarikan
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setWithdrawType("main");
                setSelectedBank("");
              }}
              className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                withdrawType === "main"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600"
                  : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400"
              }`}
            >
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Saldo Utama
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Gratis biaya admin
              </span>
            </button>
            <button
              onClick={() => setWithdrawType("bank")}
              className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                withdrawType === "bank"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600"
                  : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400"
              }`}
            >
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Bank
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Biaya admin Rp 2.500
              </span>
            </button>
          </div>
        </div>

        {/* Bank Selection (if bank withdraw) */}
        {withdrawType === "bank" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Pilih Rekening Tujuan
            </label>
            <div className="space-y-2">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                    selectedBank === bank.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600"
                      : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {bank.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bank.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {bank.accountName}
                    </p>
                  </div>
                  {selectedBank === bank.id && (
                    <div className="w-5 h-5 bg-[var(--c-primary)] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Nominal Penarikan
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium">
              Rp
            </span>
            <input
              type="tel"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimal penarikan Rp 10.000
          </p>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleQuickAmount(quickAmount)}
                className="py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-600 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white transition-all"
              >
                {quickAmount >= 1000000
                  ? `${quickAmount / 1000000}jt`
                  : `${quickAmount / 1000}rb`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {withdrawAmount > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Ringkasan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nominal Penarikan
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Rp. {withdrawAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Biaya Admin
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Rp. {totalFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Diterima</span>
                <span className="text-[var(--c-primary)] dark:text-blue-400">
                  Rp. {receivedAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {withdrawAmount > 0 && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[var(--c-primary)] hover:opacity-90 text-white font-semibold rounded-lg transition-colors"
            >
              Proses Penarikan
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showConfirmModal && (
        <ConfirmationModal
          type="withdraw"
          data={{
            product: `Penarikan ke ${
              withdrawType === "main" ? "Saldo Utama" : selectedBankData?.name
            }`,
            target:
              withdrawType === "bank"
                ? selectedBankData?.accountNumber
                : "Saldo Utama",
            customerName:
              withdrawType === "bank"
                ? selectedBankData?.accountName
                : "Demo User",
            amount: withdrawAmount,
            adminFee: totalFee,
            receivedAmount: receivedAmount,
          }}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showProcessModal && (
        <ProcessingModal
          type="withdraw"
          data={{
            product: `Penarikan ke ${
              withdrawType === "main" ? "Saldo Utama" : selectedBankData?.name
            }`,
            target:
              withdrawType === "bank"
                ? selectedBankData?.accountNumber
                : "Saldo Utama",
            customerName:
              withdrawType === "bank"
                ? selectedBankData?.accountName
                : "Demo User",
            amount: receivedAmount,
          }}
          onComplete={handleProcessComplete}
        />
      )}
    </div>
  );
};

export default PPOBWithdraw;
