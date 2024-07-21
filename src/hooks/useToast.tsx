import React, { useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timeout?: number;
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', timeout = 5000) => {
    const id = Math.random().toString(36); // Generate unique id
    const toast: Toast = { id, message, type, timeout };
    setToasts([...toasts, toast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, timeout);
  };

  const ToastComponent: React.FC<{ toast: Toast }> = ({ toast }) => (
    // <div className="d-toast d-toast-end">
    <div className="toast">
      <div className={`d-alert d-alert-${toast.type} w-full max-w-[600px] text-wrap text-white`}>
        <p>{toast.message}</p>
      </div>
    </div>
  );

  const ToastContainer: React.FC = () => (
    <div className="toast-container flex flex-col gap-2 absolute bottom-3 right-3">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );

  return {
    toast,
    ToastContainer,
  };
};

export default useToast;
