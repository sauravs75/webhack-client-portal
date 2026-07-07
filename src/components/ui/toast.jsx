import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "./alert";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((t) => [...t, { id, ...toast }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  useEffect(() => {
    const timers = toasts.map((t) => {
      if (t.duration === 0) return null;
      const timeout = setTimeout(() => removeToast(t.id), t.duration ?? 4000);
      return timeout;
    });
    return () => timers.forEach((tm) => tm && clearTimeout(tm));
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex max-w-xs flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id}>
            <Alert variant={t.variant}>{t.title ? <><strong className="mr-1">{t.title}</strong>{t.message}</> : t.message}</Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default ToastProvider;
