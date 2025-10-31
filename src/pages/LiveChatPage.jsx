import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Video, MoreVertical, Circle } from "lucide-react";
import LiveChat from "../components/cs/LiveChat";
import useChatStore from "../store/chatStore";
import { useUserStore } from "../store/userStore";

const LiveChatPage = () => {
  const navigate = useNavigate();
  const {
    currentAgent,
    isConnected,
    connectChat,
    disconnectChat,
    markAsRead,
    fetchChatHistory,
    clearMessages,
  } = useChatStore();

  const { user } = useUserStore();

  useEffect(() => {
    // Always connect in demo mode
    // Clear previous chat and start fresh demo
    clearMessages();
    // Connect to chat (demo mode)
    connectChat("demo-user");
    // Mark messages as read when entering chat
    markAsRead();

    // Cleanup on unmount - don't disconnect to avoid flashing states
    return () => {
      // Only disconnect when truly leaving, not on re-renders
    };
  }, []);

  // Mark as read when component is visible
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        markAsRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const getAgentStatus = () => {
    if (!isConnected) return "Offline";
    if (currentAgent?.status === "online") return "Online";
    return "Away";
  };

  const getStatusColor = () => {
    if (!isConnected) return "text-gray-400";
    if (currentAgent?.status === "online") return "text-green-500";
    return "text-yellow-500";
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            {/* Agent Info */}
            <div className="flex items-center gap-3 flex-1">
              {/* Agent Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                  {currentAgent?.photo ? (
                    <img
                      src={currentAgent.photo}
                      alt={currentAgent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                      CS
                    </span>
                  )}
                </div>
                {/* Status Indicator */}
                <Circle
                  size={10}
                  className={`absolute bottom-0 right-0 ${getStatusColor()} fill-current`}
                />
              </div>

              {/* Agent Name & Status */}
              <div className="flex-1">
                <h1 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {currentAgent?.name || "Customer Support"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getAgentStatus()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors hidden"
              title="Voice call"
            >
              <Phone size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors hidden"
              title="Video call"
            >
              <Video size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="More options"
            >
              <MoreVertical
                size={20}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
          </div>
        </div>

        {/* Agent Description */}
        {currentAgent?.description && (
          <div className="mt-2 ml-14">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentAgent.description}
            </p>
          </div>
        )}
      </div>

      {/* Chat Component */}
      <LiveChat />
    </div>
  );
};

export default LiveChatPage;
