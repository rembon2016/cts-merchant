import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

CustomToast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  duration: PropTypes.number,
};

export default function CustomToast({
  message,
  type = "success",
  isVisible = false,
  onClose,
  duration = 1500,
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsExiting(false);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onClose?.();
        }, 250); 
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isExiting) return null;

  const iconConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-green-500",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-500",
      textColor: "text-red-500",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-500",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
    },
  };

  const { icon: Icon, bgColor } = iconConfig[type];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
      {/* Overlay - Disabled */}
      {/* <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`} /> */}

      <div className={`relative z-10 ${isExiting ? 'animate-toastSlideDown' : 'animate-toastSlideUp'}`}>
        <div 
          className="rounded-2xl shadow-2xl px-8 py-6 max-w-[280px] mx-4 backdrop-blur-md"
          style={{ 
            backgroundColor: '#00000061',
            willChange: 'transform, backdrop-filter',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`${bgColor} rounded-full p-3`}
            >
              <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            <p 
              className="text-center font-medium text-base leading-snug"
              style={{ color: '#fff' }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
