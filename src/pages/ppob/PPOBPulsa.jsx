import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ProductCard from '../../components/ppob/ProductCard';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBPulsa = () => {
  const navigate = useNavigate();
  const { detectOperator, getProductsByCategory, getMockCustomer } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [activeTab, setActiveTab] = useState('pulsa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  
  const products = getProductsByCategory('pulsa');
  const tabs = [
    { id: 'pulsa', label: 'Pulsa' },
    { id: 'data', label: 'Paket Data' },
    { id: 'sms', label: 'Telepon & SMS' }
  ];
  
  useEffect(() => {
    if (phoneNumber.length >= 4) {
      const operator = detectOperator(phoneNumber);
      setDetectedOperator(operator);
      
      if (phoneNumber.length >= 10) {
        const customer = getMockCustomer('pulsa', phoneNumber);
        setCustomerInfo(customer);
      }
    } else {
      setDetectedOperator(null);
      setCustomerInfo(null);
    }
  }, [phoneNumber, detectOperator, getMockCustomer]);
  
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 13) {
      setPhoneNumber(value);
    }
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pulsa & Paket Data</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Isi pulsa semua operator</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[var(--c-primary)] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Phone Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Nomor HP
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
          
          {detectedOperator && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">
                <i className={detectedOperator.icon}></i>
              </span>
              <span className="font-medium text-gray-900 dark:text-white">{detectedOperator.name}</span>
              {customerInfo && (
                <span className="text-gray-600 dark:text-gray-400">• {customerInfo.name}</span>
              )}
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {phoneNumber.length >= 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Pilih Nominal
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => (
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
        
        {/* Info Message */}
        {phoneNumber.length === 0 && (
          <div className="text-center py-8">
            <Phone className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Masukkan nomor HP untuk memulai</p>
          </div>
        )}
      </div>
      
      {/* Continue Button */}
      {phoneNumber && selectedProduct && (
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
          <button
            onClick={handleContinue}
            className="w-full bg-[var(--c-primary)] hover:opacity-90 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Lanjutkan
          </button>
        </div>
      )}
      
      {/* Modals */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          data={{
            productName: selectedProduct.name,
            target: phoneNumber,
            targetLabel: 'Nomor HP',
            customerName: customerInfo?.name || '-',
            amount: selectedProduct.price,
            total: selectedProduct.price,
            commission: selectedProduct.commission
          }}
        />
      )}
      
      {showProcessModal && (
        <ProcessingModal
          isOpen={showProcessModal}
          status="success"
          data={{
            refNumber: 'PPOB-' + Date.now(),
            productName: selectedProduct.name,
            target: phoneNumber
          }}
          onClose={handleProcessComplete}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBPulsa;
