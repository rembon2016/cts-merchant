import { ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTicketStore } from '../store/ticketStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import CustomLoading from '../components/CustomLoading';

const TicketCreate = () => {
  const navigate = useNavigate();
  const { createTicket, loading } = useTicketStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    orderId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);

  const categories = [
    { value: 'transaction', label: 'Transaksi' },
    { value: 'pos', label: 'POS' },
    { value: 'account', label: 'Akun' },
    { value: 'payment', label: 'Pembayaran' },
    { value: 'technical', label: 'Teknis' },
    { value: 'other', label: 'Lainnya' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriorityChange = (priority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'].includes(file.type);
      return isValidSize && isValidType;
    });
    
    if (validFiles.length !== files.length) {
      toast.error('Beberapa file tidak valid (max 10MB, format: jpg, png, pdf, doc)');
    }
    
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = 'Kategori harus dipilih';
    if (!formData.title.trim()) newErrors.title = 'Judul harus diisi';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi harus diisi';
    if (formData.title.length < 5) newErrors.title = 'Judul minimal 5 karakter';
    if (formData.description.length < 10) newErrors.description = 'Deskripsi minimal 10 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Mohon lengkapi form dengan benar');
      return;
    }

    try {
      const ticketData = {
        ...formData,
        userId: user?.id || 'user123',
        attachments: attachments.map(f => f.name)
      };
      
      await createTicket(ticketData);
      toast.success('Laporan berhasil dibuat!');
      navigate('/cs/tickets');
    } catch (error) {
      toast.error('Gagal membuat Laporan. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Buat Laporan Baru</h1>
        </div>
      </div>

      {loading && <CustomLoading />}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori Masalah <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.category 
                ? 'border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Pilih kategori</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Priority */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioritas <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {priorities.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => handlePriorityChange(p.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.priority === p.value 
                    ? `${p.color} ring-2 ring-offset-2 ring-blue-500` 
                    : `${p.color} opacity-60`
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Judul Masalah <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Pembayaran tidak masuk"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.title 
                ? 'border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deskripsi Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Jelaskan masalah Anda dengan detail..."
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.description 
                ? 'border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Order ID */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order ID (Opsional)
          </label>
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder="Contoh: ORD-2025-001"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lampiran (Opsional)
          </label>
          <div className="space-y-2">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Klik untuk upload file
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Max 10MB (jpg, png, pdf, doc)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,application/pdf,application/msword"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--c-primary)] from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketCreate;
