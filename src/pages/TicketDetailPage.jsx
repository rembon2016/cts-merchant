import { ArrowLeft, Send, Paperclip, MoreVertical, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTicketStore } from '../store/ticketStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import CustomLoading from '../components/CustomLoading';

const TicketDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedTicket, loading, fetchTicketById, addReply, closeTicket } = useTicketStore();
  const { user } = useAuthStore();
  
  const [replyMessage, setReplyMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicketById(id);
    }
  }, [id, fetchTicketById]);

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      resolved: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    setSending(true);
    try {
      await addReply(id, replyMessage, 'user', user?.name || 'User');
      setReplyMessage('');
      toast.success('Balasan terkirim');
    } catch (error) {
      toast.error('Gagal mengirim balasan');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (window.confirm('Yakin ingin menutup Laporan ini?')) {
      try {
        await closeTicket(id);
        toast.success('Laporan ditutup');
        setShowMenu(false);
        navigate('/cs/tickets');
      } catch (error) {
        toast.error('Gagal menutup Laporan');
      }
    }
  };

  if (loading && !selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <CustomLoading />
      </div>
    );
  }

  if (!selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Laporan tidak ditemukan</p>
          <button
            onClick={() => navigate('/cs/tickets')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Kembali ke daftar Laporan
          </button>
        </div>
      </div>
    );
  }

  const canReply = selectedTicket.status !== 'closed';

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTicket.id}
              </h1>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                {selectedTicket.status}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                {canReply && (
                  <button
                    onClick={handleCloseTicket}
                    className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Tutup Laporan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Ticket Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {selectedTicket.category}
            </span>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedTicket.title}
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
            {selectedTicket.description}
          </p>
          
          {selectedTicket.orderId && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Order ID:</span>
              <span className="font-mono">{selectedTicket.orderId}</span>
            </div>
          )}
          
          {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lampiran:</p>
              <div className="space-y-1">
                {selectedTicket.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Paperclip className="w-4 h-4" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Dibuat: {formatDate(selectedTicket.createdAt)}
          </p>
        </div>

        {/* Chat Thread */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">
            Percakapan
          </h3>
          
          {selectedTicket.replies.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Belum ada balasan. Silakan kirim pesan untuk memulai percakapan.
              </p>
            </div>
          ) : (
            selectedTicket.replies.map((reply) => (
              <div
                key={reply.id}
                className={`flex ${reply.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    reply.sender === 'user'
                      ? 'bg-[var(--c-primary)] text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  }`}
                >
                  <p className="text-xs font-medium mb-1 opacity-75">
                    {reply.senderName}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {formatTime(reply.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reply Input - Fixed at bottom above nav */}
      {canReply && (
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 mb-28">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Tulis balasan..."
              rows={1}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <button
              onClick={handleSendReply}
              disabled={sending || !replyMessage.trim()}
              className="p-3 bg-[var(--c-primary)] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;
