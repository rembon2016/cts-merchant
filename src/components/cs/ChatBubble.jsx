import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import useChatStore from '../../store/chatStore';

const ChatBubble = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useChatStore();

  // Hide on chat page itself
  const isOnChatPage = location.pathname === '/cs/chat';
  
  if (isOnChatPage) {
    return null;
  }

  const handleClick = () => {
    navigate('/cs/chat');
  };

  return (
    // <>
    //   {/* Floating Action Button */}
    //   <button
    //     onClick={handleClick}
    //     className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 Laporan hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
    //     style={{ minWidth: '56px', minHeight: '56px' }}
    //     aria-label="Open live chat"
    //   >
    //     {/* Unread Badge */}
    //     {unreadCount > 0 && (
    //       <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
    //         {unreadCount > 9 ? '9+' : unreadCount}
    //       </div>
    //     )}

    //     {/* Icon */}
    //     <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />

    //     {/* Ripple Effect on Hover */}
    //     <span className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></span>
    //   </button>

    //   {/* Tooltip (Optional) */}
    //   <div className="fixed bottom-20 right-20 md:bottom-6 md:right-24 z-40 pointer-events-none">
    //     <div className="bg-gray-800 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    //       Chat with us
    //       <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45"></div>
    //     </div>
    //   </div>
    // </>
    <></>
  );
};

export default ChatBubble;
