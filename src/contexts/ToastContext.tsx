import React, { createContext, useContext } from 'react';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    // Version simplifiée : utilise console.log + alert
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Ajouter des emojis pour rendre plus visuel
    const emoji = {
      success: '✅',
      error: '❌', 
      info: 'ℹ️',
      warning: '⚠️'
    }[type];
    
    alert(`${emoji} ${message}`);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
