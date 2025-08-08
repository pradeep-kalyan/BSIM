// components/Toast.tsx
import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // in milliseconds
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl text-white shadow-xl ${bgColor} z-50`}>
      {message}
    </div>
  );
};

export default Toast;
