import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgStyles = {
    success: 'bg-[#10b981] text-white',
    info: 'bg-[#0b3c5d] text-white',
    warning: 'bg-[#f59e0b] text-slate-900',
    error: 'bg-[#ef4444] text-white',
  };

  const iconMap = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 ${bgStyles[type]}`}
    >
      <span className="font-bold text-base">{iconMap[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white text-sm"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
};
