import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBPascabayar = () => {
  const navigate = useNavigate();
  const { pascabayarProviders, getMockCustomer } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [activeTab, setActiveTab] = useState('telepon');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  
  const tabs = [
    { id: 'telepon', label: 'Telepon', icon: 'bx bx-phone' },
    { id: 'internet', label: 'Internet', icon: 'bx bx-globe' },
    { id: 'tv', label: 'TV Kabel', icon: 'bx bx-tv' },
  ];
  
  const handleCustomerIdChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 13) {
      setCustomerId(value);
      setCustomerData(null);
    }
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedProvider('');
    setCustomerId('');
    setCustomerData(null);
  };
  
  const handleCheckBill = () => {
    if (!selectedProvider || !customerId) return;
    
    const mockData = getMockCustomer('pascabayar', customerId);
    if (mockData && mockData.provider === selectedProvider && mockData.type === activeTab) {
      setCustomerData(mockData);
    } else {
      toast.error('Data pelanggan tidak ditemukan', {
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
  
  const currentProviders = pascabayarProviders[activeTab] || [];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ppob')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pascabayar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bayar tagihan bulanan</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 grid grid-cols-3 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">
                <i className={tab.icon}></i>
              </span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Provider Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Pilih Provider
          </label>
          <div className="grid grid-cols-2 gap-3">
            {currentProviders.map(provider => (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProvider(provider.id);
                  setCustomerId('');
                  setCustomerData(null);
                }}
                className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
                  selectedProvider === provider.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400'
                }`}
              >
                <span className="text-2xl">
                  <i className={provider.icon}></i>
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Customer ID Input */}
        {selectedProvider && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              ID Pelanggan
            </label>
            <div className="space-y-3">
              <input
                type="tel"
                value={customerId}
                onChange={handleCustomerIdChange}
                placeholder="Masukkan ID Pelanggan"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                onClick={handleCheckBill}
                disabled={!customerId || customerId.length < 6}
                className="w-full py-3 bg-[var(--c-primary)] hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Cek Tagihan
              </button>
            </div>
          </div>
        )}
        
        {/* Customer Data Display */}
        {customerData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Detail Tagihan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nama Pelanggan</span>
                <span className="font-medium text-gray-900 dark:text-white">{customerData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Alamat</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">{customerData.address}</span>
              </div>
              {customerData.package && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Paket</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerData.package}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Periode</span>
                <span className="font-medium text-gray-900 dark:text-white">{customerData.period}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tagihan</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp. {customerData.bill.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Biaya Admin</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp. {customerData.adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <span className="text-gray-900 dark:text-white">Total Bayar</span>
                  <span className="text-[var(--c-primary)] dark:text-blue-400">Rp. {(customerData.bill + customerData.adminFee).toLocaleString('id-ID')}</span>
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
          type="pascabayar"
          data={{
            product: `Tagihan ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - ${customerData.period}`,
            target: customerId,
            customerName: customerData.name,
            amount: customerData.bill + customerData.adminFee,
            details: customerData.package || '',
          }}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      {showProcessModal && customerData && (
        <ProcessingModal
          type="pascabayar"
          data={{
            product: `Tagihan ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - ${customerData.period}`,
            target: customerId,
            customerName: customerData.name,
            amount: customerData.bill + customerData.adminFee,
          }}
          onComplete={handleProcessComplete}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBPascabayar;
