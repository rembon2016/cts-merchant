import React, { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Loader2, AlertCircle } from 'lucide-react';
import useChatStore from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';

const LiveChat = () => {
  const {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    uploadFile,
    demoStep,
    isAgentMode,
    demoComplete
  } = useChatStore();

  const { user } = useUserStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Quick reply suggestions based on demo step
  const getSuggestions = () => {
    if (demoComplete) return [];
    
    if (demoStep === 0) {
      // Initial suggestions
      return [
        'Saya ingin bertanya tentang transaksi',
        'Ada masalah dengan POS saya',
        'Bagaimana cara menggunakan fitur ini?'
      ];
    } else if (demoStep === 1) {
      // After first bot response
      return [
        'Tolong hubungkan dengan agent',
        'Saya perlu bantuan lebih lanjut',
        'Ya, hubungkan saya dengan agent'
      ];
    } else if (demoStep === 2) {
      // After connected to agent
      return [
        'Saya butuh bantuan refund',
        'Transaksi saya bermasalah',
        'POS tidak berfungsi dengan baik'
      ];
    } else if (demoStep === 3) {
      // After agent response
      return [
        'Terima kasih',
        'Saya mengerti',
        'Oke, saya tunggu'
      ];
    }
    return [];
  };

  const suggestions = getSuggestions();

  // Reset showSuggestions when demoStep changes
  useEffect(() => {
    if (suggestions.length > 0 && !demoComplete) {
      setShowSuggestions(true);
    }
  }, [demoStep, suggestions.length, demoComplete]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      sendMessage(inputMessage.trim(), true);
      setInputMessage('');
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSuggestionClick = async (suggestionText) => {
    try {
      sendMessage(suggestionText, true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('File type not supported. Please upload images, PDF, or Word documents.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const fileUrl = await uploadFile(file);
      await sendMessage({
        text: file.name,
        type: 'file',
        fileUrl
      });
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
      console.error('File upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message, index) => {
    const isUser = message.sender === 'user';
    const isFile = message.type === 'file';
    const isSystem = message.sender === 'system' || message.type === 'system';

    // Render system messages differently (centered)
    if (isSystem) {
      return (
        <div key={message.id || index} className="flex justify-center mb-4">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-700">
            {message.message}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id || index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
              {message.senderName || 'Agent'}
            </p>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
            }`}
          >
            {isFile ? (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 underline"
              >
                <Paperclip size={16} />
                <span className="text-sm">{message.message}</span>
              </a>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.message}
              </p>
            )}
          </div>
          <p className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-900">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-sm text-center flex items-center justify-center gap-2 flex-shrink-0">
          <AlertCircle size={16} />
          <span>Connecting to chat...</span>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-blue-500" />
            </div>
            <p className="text-lg font-medium mb-2">Mulai Percakapan</p>
            <p className="text-sm px-4">Kirim pesan atau pilih salah satu saran di bawah untuk memulai chat dengan customer support kami</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Reply Suggestions */}
      {suggestions.length > 0 && showSuggestions && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Saran Balasan:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-500 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm flex-shrink-0">
          {uploadError}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 bg-white dark:bg-gray-900 mb-24">
        <div className="flex items-end gap-2">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={!isConnected || isUploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected || isUploading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Attach file"
          >
            {isUploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Paperclip size={24} />
            )}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              disabled={!isConnected}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !isConnected}
            className="p-2 bg-[var(--c-primary)] text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
