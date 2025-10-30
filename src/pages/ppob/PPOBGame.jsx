import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import { usePPOBStore } from '../../store/ppobStore';
import ProductCard from '../../components/ppob/ProductCard';
import ConfirmationModal from '../../components/ppob/ConfirmationModal';
import ProcessingModal from '../../components/ppob/ProcessingModal';

const PPOBGame = () => {
  const navigate = useNavigate();
  const { getProductsByCategory } = usePPOBProductStore();
  const { balance } = usePPOBStore();
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    zoneId: '',
    serverId: '',
    riotId: '',
    username: '',
    steamId: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  
  const games = getProductsByCategory('game');
  
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedProduct(null);
    setFormData({
      userId: '',
      zoneId: '',
      serverId: '',
      riotId: '',
      username: '',
      steamId: ''
    });
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  
  const isFormValid = () => {
    if (!selectedGame) return false;
    
    const fields = selectedGame.fields || ['userId'];
    return fields.every(field => formData[field]?.trim());
  };
  
  const handleContinue = () => {
    if (!isFormValid() || !selectedProduct) return;
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
  
  const renderInputFields = () => {
    if (!selectedGame) return null;
    
    const fields = selectedGame.fields || ['userId'];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
        {fields.includes('userId') && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              User ID
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              placeholder="Masukkan User ID"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        )}
        
        {fields.includes('zoneId') && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Zone ID
            </label>
            <input
              type="text"
              value={formData.zoneId}
              onChange={(e) => handleInputChange('zoneId', e.target.value)}
              placeholder="Masukkan Zone ID"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        )}
        
        {fields.includes('serverId') && selectedGame.servers && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Server
            </label>
            <select
              value={formData.serverId}
              onChange={(e) => handleInputChange('serverId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Pilih Server</option>
              {selectedGame.servers.map(server => (
                <option key={server} value={server}>{server}</option>
              ))}
            </select>
          </div>
        )}
        
        {fields.includes('riotId') && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Riot ID (Name#Tag)
            </label>
            <input
              type="text"
              value={formData.riotId}
              onChange={(e) => handleInputChange('riotId', e.target.value)}
              placeholder="Contoh: PlayerName#1234"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        )}
        
        {fields.includes('username') && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Masukkan Username"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        )}
        
        {fields.includes('steamId') && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Steam ID
            </label>
            <input
              type="text"
              value={formData.steamId}
              onChange={(e) => handleInputChange('steamId', e.target.value)}
              placeholder="Masukkan Steam ID"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        )}
      </div>
    );
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Voucher Game</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top up game favorit Anda</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Game Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Pilih Game
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  selectedGame?.id === game.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <span className="text-4xl">
                  <i className={game.icon}></i>
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                  {game.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Input Fields */}
        {selectedGame && renderInputFields()}
        
        {/* Products Grid */}
        {selectedGame && isFormValid() && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Pilih Nominal
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {selectedGame.nominals.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    name: product.item
                  }}
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
              disabled={!isFormValid() || !selectedProduct}
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
            productName: `${selectedGame.name} - ${selectedProduct.item}`,
            target: formData.userId || formData.username || formData.riotId || formData.steamId,
            targetLabel: 'User ID',
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
            productName: `${selectedGame.name} - ${selectedProduct.item}`,
            target: formData.userId || formData.username || formData.riotId || formData.steamId
          }}
          onClose={handleProcessComplete}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBGame;
