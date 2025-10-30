import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      // State
      messages: [],
      currentAgent: null,
      isConnected: false,
      isTyping: false,
      unreadCount: 0,
      chatId: null,
      ws: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      demoStep: 0, // Track demo conversation step
      isAgentMode: false, // Track if in agent mode
      demoComplete: false, // Track if demo is complete

      // Actions
      connectChat: async (userId) => {
        // Demo mode - simulate connection immediately
        set({ 
          isConnected: true,
          chatId: 'demo-chat-001',
          currentAgent: {
            name: 'CS Bot',
            avatar: null,
            status: 'online'
          }
        });

        // Send welcome message from bot after 1 second only if no messages exist
        setTimeout(() => {
          const currentState = get();
          // Check if welcome message already exists
          const hasWelcomeMessage = currentState.messages.some(
            msg => msg.id === 'bot-welcome-1'
          );
          
          if (!hasWelcomeMessage) {
            const welcomeMessage = {
              id: 'bot-welcome-1',
              sender: 'agent',
              senderName: 'CS Bot',
              message: 'Halo! Selamat datang di Customer Support CTS Merchant. Ada yang bisa saya bantu?',
              type: 'text',
              fileUrl: null,
              createdAt: new Date().toISOString(),
              isRead: true
            };
            set(state => ({
              messages: [...state.messages, welcomeMessage]
            }));
          }
        }, 1000);
      },

      disconnectChat: () => {
        // Demo mode - just reset state
        set({ 
          isConnected: false,
          reconnectAttempts: 0 
        });
      },

        sendMessage: (text, isUser = true) => {
    const state = get();
    
    // Prevent sending messages after demo is complete
    if (state.demoComplete) {
      return;
    }

    // Add user message immediately
    if (isUser) {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now(),
            message: text,
            sender: 'user',
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    }

    // Demo mode logic - simulate responses
    const currentStep = state.demoStep;

    if (currentStep === 0) {
      // First interaction - bot responds with branching logic
      setTimeout(() => {
        set((state) => ({ isTyping: true }));
      }, 500);

      setTimeout(() => {
        let botResponse = '';
        
        // Branch based on what user asked about
        if (text.toLowerCase().includes('transaksi')) {
          botResponse = 'Saya mengerti Anda memiliki pertanyaan tentang transaksi. Untuk memberikan bantuan yang lebih detail mengenai masalah transaksi Anda, saya akan menghubungkan Anda dengan agent kami yang lebih berpengalaman dalam menangani hal ini.';
        } else if (text.toLowerCase().includes('pos')) {
          botResponse = 'Terima kasih telah menghubungi kami mengenai POS. Untuk menyelesaikan masalah POS Anda dengan lebih baik, saya akan menghubungkan Anda dengan agent kami yang spesialis dalam sistem POS.';
        } else if (text.toLowerCase().includes('fitur') || text.toLowerCase().includes('cara')) {
          botResponse = 'Saya siap membantu Anda memahami fitur-fitur kami. Namun untuk panduan yang lebih lengkap dan interaktif, akan lebih baik jika saya menghubungkan Anda dengan agent kami yang dapat memberikan penjelasan lebih detail.';
        } else {
          botResponse = 'Terima kasih sudah menghubungi customer support kami. Untuk memberikan bantuan terbaik, saya akan menghubungkan Anda dengan agent kami yang lebih berpengalaman.';
        }

        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now() + 1,
              message: botResponse,
              sender: 'bot',
              senderName: 'CS Bot',
              createdAt: new Date().toISOString(),
            },
          ],
          isTyping: false,
          demoStep: 1,
        }));
      }, 2000);
    } else if (currentStep === 1) {
      // Second interaction - connect to agent
      setTimeout(() => {
        set((state) => ({ isTyping: true }));
      }, 500);

      setTimeout(() => {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now() + 1,
              message: 'Baik, saya akan menghubungkan Anda dengan agent. Mohon tunggu sebentar...',
              sender: 'bot',
              senderName: 'CS Bot',
              createdAt: new Date().toISOString(),
            },
          ],
          isTyping: false,
        }));

        // Connect to agent after 2 seconds
        setTimeout(() => {
          set((state) => ({
            currentAgent: {
              name: 'Alex',
              avatar: null,
              status: 'online',
            },
            isAgentMode: true,
            messages: [
              ...state.messages,
              {
                id: Date.now() + 1,
                message: 'Terhubung dengan Alex',
                sender: 'system',
                senderName: 'System',
                type: 'system',
                createdAt: new Date().toISOString(),
              },
            ],
            isTyping: true,
          }));

          // Agent greeting
          setTimeout(() => {
            set((state) => ({
              messages: [
                ...state.messages,
                {
                  id: Date.now() + 2,
                  message: 'Halo! Saya Alex dari tim customer support. Ada yang bisa saya bantu hari ini?',
                  sender: 'agent',
                  senderName: 'Alex',
                  createdAt: new Date().toISOString(),
                },
              ],
              isTyping: false,
              demoStep: 2,
            }));
          }, 2000);
        }, 2000);
      }, 2000);
    } else if (currentStep === 2) {
      // User responds to agent - branch based on topic
      setTimeout(() => {
        set((state) => ({ isTyping: true }));
      }, 500);

      setTimeout(() => {
        let agentResponse = '';
        
        if (text.toLowerCase().includes('refund')) {
          agentResponse = 'Baik, saya akan bantu proses refund Anda. Bisa berikan nomor transaksi yang ingin di-refund? Biasanya proses refund memakan waktu 3-5 hari kerja setelah disetujui.';
        } else if (text.toLowerCase().includes('transaksi') || text.toLowerCase().includes('bermasalah')) {
          agentResponse = 'Saya pahami transaksi Anda bermasalah. Bisa jelaskan lebih detail masalahnya? Apakah transaksi gagal, pending, atau ada kendala lain? Saya akan bantu cek status transaksi Anda.';
        } else if (text.toLowerCase().includes('pos') || text.toLowerCase().includes('berfungsi')) {
          agentResponse = 'Untuk masalah POS, bisa dijelaskan error apa yang muncul? Apakah koneksi internet stabil? Saya juga bisa remote akses untuk membantu troubleshooting jika diperlukan.';
        } else {
          agentResponse = 'Terima kasih sudah menjelaskan. Saya akan memproses permintaan Anda segera. Tim kami akan follow up dalam 1x24 jam. Apakah ada yang lain yang bisa saya bantu?';
        }

        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now() + 1,
              message: agentResponse,
              sender: 'agent',
              senderName: 'Alex',
              createdAt: new Date().toISOString(),
            },
          ],
          isTyping: false,
          demoStep: 3,
        }));
      }, 2500);
    } else if (currentStep === 3) {
      // Final agent response
      setTimeout(() => {
        set((state) => ({ isTyping: true }));
      }, 500);

      setTimeout(() => {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now() + 1,
              message: 'Baik, saya sudah catat semua informasi Anda. Kami akan segera tindak lanjuti. Jangan ragu untuk menghubungi kami lagi jika ada pertanyaan. Terima kasih! 😊',
              sender: 'agent',
              senderName: 'Alex',
              createdAt: new Date().toISOString(),
            },
          ],
          isTyping: false,
          demoComplete: true,
        }));
      }, 2000);
    }
  },

      receiveMessage: (message) => {
        set(state => {
          // Check if message already exists (to avoid duplicates)
          const exists = state.messages.some(m => m.id === message.id);
          if (exists) {
            return state;
          }

          // Increment unread count if message is from agent
          const newUnreadCount = message.sender === 'agent' && !message.isRead
            ? state.unreadCount + 1
            : state.unreadCount;

          return {
            messages: [...state.messages, message],
            unreadCount: newUnreadCount,
            isTyping: false
          };
        });
      },

      setTyping: (status) => {
        set({ isTyping: status });
      },

      markAsRead: () => {
        const { ws, chatId } = get();
        
        set({ unreadCount: 0 });
        
        // Send read receipt via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'mark_read',
            chatId
          }));
        }
      },

      clearMessages: () => {
        set({ 
          messages: [], 
          unreadCount: 0,
          demoStep: 0,
          isAgentMode: false,
          demoComplete: false,
          currentAgent: null
        });
      },

      fetchChatHistory: async (userId) => {
        try {
          const API_URL = import.meta.env.VITE_API_ROUTES || 'http://localhost:3000';
          const response = await fetch(`${API_URL}/api/cs/chat/history?userId=${userId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch chat history');
          }

          const data = await response.json();
          set({ 
            messages: data.messages || [],
            chatId: data.chatId,
            currentAgent: data.agent || null
          });
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        }
      },

      uploadFile: async (file) => {
        try {
          const API_URL = import.meta.env.VITE_API_ROUTES || 'http://localhost:3000';
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${API_URL}/api/cs/chat/upload`, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Failed to upload file');
          }

          const data = await response.json();
          return data.fileUrl;
        } catch (error) {
          console.error('Failed to upload file:', error);
          throw error;
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        // Don't persist demo-related state
        unreadCount: state.unreadCount
      })
    }
  )
);

export default useChatStore;
