import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const getToastClasses = () => {
    const baseClasses = "flex items-center p-4 rounded-lg shadow-md min-w-[300px] max-w-md";
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 text-green-800 border-l-4 border-green-500`;
      case 'error':
        return `${baseClasses} bg-red-50 text-red-800 border-l-4 border-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 text-blue-800 border-l-4 border-blue-500`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 mr-3" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 mr-3" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500 mr-3" />;
    }
  };

  return (
    <div className={`${getToastClasses()} animate-fade-in-up`}>
      {getIcon()}
      <p className="flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="ml-3 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;