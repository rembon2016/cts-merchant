import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ProductCard from '../../components/ppob/ProductCard';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBListrik = () => {
  const navigate = useNavigate();
  const { getProductsByCategory, getMockCustomer } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [activeTab, setActiveTab] = useState('token');
  const [meterId, setMeterId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [tokenNumber, setTokenNumber] = useState('');
  
  const products = getProductsByCategory('listrik');
  const tabs = [
    { id: 'token', label: 'Token Listrik' },
    { id: 'tagihan', label: 'Tagihan Listrik' }
  ];
  
  const handleMeterChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 12) {
      setMeterId(value);
      setCustomerData(null);
    }
  };
  
  const handleCheckMeter = () => {
    if (meterId.length < 11) {
      toast.warning('Nomor meter harus 11-12 digit', {
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
    const customer = getMockCustomer('listrik', meterId);
    if (customer) {
      setCustomerData(customer);
    } else {
      toast.error('Nomor meter tidak ditemukan', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setCustomerData(null);
    }
  };
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  
  const generateToken = () => {
    // Generate random 20-digit token (4 groups of 5 digits)
    const groups = [];
    for (let i = 0; i < 4; i++) {
      const group = Math.floor(10000 + Math.random() * 90000);
      groups.push(group);
    }
    return groups.join('-');
  };
  
  const handleContinue = () => {
    if (!meterId || !selectedProduct || !customerData) return;
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
    setTokenNumber(generateToken());
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
          <div className="flex items-center gap-2">
            <i className='bx bxs-bolt text-yellow-500 text-2xl'></i>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Listrik PLN</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Token & Tagihan PLN</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Meter Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Nomor Meter / ID Pelanggan
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={meterId}
                onChange={handleMeterChange}
                placeholder="12345678901"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCheckMeter}
              disabled={meterId.length < 11}
              className="px-6 py-3 bg-[var(--c-primary)] hover:opacity-90 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Cek
            </button>
          </div>
          
          {customerData && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
              <p className="font-semibold text-gray-900 dark:text-white">{customerData.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{customerData.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarif: {customerData.tariff}</p>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {customerData && (
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
        {meterId.length === 0 && (
          <div className="text-center py-8">
            <Zap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Masukkan nomor meter untuk memulai</p>
          </div>
        )}
      </div>
      
      {/* Continue Button */}
      {customerData && selectedProduct && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
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
            target: meterId,
            targetLabel: 'ID Pelanggan',
            customerName: customerData.name,
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
            target: meterId,
            token: tokenNumber
          }}
          onClose={handleProcessComplete}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBListrik;
