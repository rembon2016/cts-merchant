import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ProductCard from '../../components/ppob/ProductCard';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBEWallet = () => {
  const navigate = useNavigate();
  const { getProductsByCategory } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  
  const wallets = getProductsByCategory('ewallet');
  
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 13) {
      setPhoneNumber(value);
    }
  };
  
  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setSelectedProduct(null);
  };
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  
  const handleContinue = () => {
    if (!phoneNumber || !selectedProduct) return;
    if (balance < selectedProduct.price) {
      toast.error('Saldo PPOB tidak mencukupi!', {
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
    navigate('/ppob/history');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ppob')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">E-Wallet Top Up</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Isi saldo e-wallet Anda</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Wallet Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Pilih E-Wallet
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {wallets.map(wallet => (
              <button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  selectedWallet?.id === wallet.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <span className="text-4xl">
                  <i className={wallet.icon}></i>
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                  {wallet.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Phone Input */}
        {selectedWallet && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Nomor HP Terdaftar {selectedWallet.name}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="08xx xxxx xxxx"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        {selectedWallet && phoneNumber.length >= 10 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Pilih Nominal
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {selectedWallet.nominals.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={selectedProduct?.id === product.id}
                  onClick={() => handleProductSelect(product)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Continue Button */}
        {selectedProduct && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
            <button
              onClick={handleContinue}
              disabled={!phoneNumber || !selectedProduct}
              className="w-full py-3 bg-[var(--c-primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:active:scale-100 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              Lanjutkan
            </button>
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && selectedProduct && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          data={{
            productName: `Top Up ${selectedWallet.name}`,
            target: phoneNumber,
            targetLabel: 'Nomor HP',
            amount: selectedProduct.price,
            total: selectedProduct.price,
            commission: selectedProduct.commission
          }}
        />
      )}
      
      {/* Processing Modal */}
      {showProcessModal && selectedProduct && (
        <ProcessingModal
          isOpen={showProcessModal}
          status="success"
          data={{
            refNumber: 'PPOB-' + Date.now(),
            productName: `Top Up ${selectedWallet.name}`,
            target: phoneNumber
          }}
          onClose={handleProcessComplete}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBEWallet;
