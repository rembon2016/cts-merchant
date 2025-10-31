import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBPdam = () => {
  const navigate = useNavigate();
  const { pdamRegions, getMockCustomer } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [selectedRegion, setSelectedRegion] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  
  const handleCustomerIdChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 12) {
      setCustomerId(value);
      setCustomerData(null);
    }
  };
  
  const handleCheckBill = () => {
    if (!selectedRegion || !customerId) return;
    
    const mockData = getMockCustomer('pdam', customerId);
    if (mockData && mockData.region === selectedRegion) {
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ppob')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">PDAM</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bayar tagihan air PDAM</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Region Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Pilih Wilayah PDAM
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setCustomerId('');
              setCustomerData(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">-- Pilih Wilayah --</option>
            {pdamRegions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>
        
        {/* Customer ID Input */}
        {selectedRegion && (
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
                disabled={!customerId || customerId.length < 9}
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
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Periode</span>
                <span className="font-medium text-gray-900 dark:text-white">{customerData.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pemakaian</span>
                <span className="font-medium text-gray-900 dark:text-white">{customerData.usage}</span>
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
          type="pdam"
          data={{
            product: `Tagihan PDAM ${customerData.period}`,
            target: customerId,
            customerName: customerData.name,
            amount: customerData.bill + customerData.adminFee,
            details: `${customerData.usage} - ${customerData.period}`,
          }}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      {showProcessModal && customerData && (
        <ProcessingModal
          type="pdam"
          data={{
            product: `Tagihan PDAM ${customerData.period}`,
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

export default PPOBPdam;
