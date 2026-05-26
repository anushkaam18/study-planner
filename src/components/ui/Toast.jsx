import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

/**
 * Premium glassmorphic Toast notification component.
 * Replaces unstyled native browser alerts with polished animations.
 * 
 * @param {string} message - Notification text content
 * @param {'success' | 'error'} type - Style theme of the toast
 * @param {function} onClose - Triggers toast dismissal
 * @param {number} duration - Autoplay decay duration (ms)
 */
export default function Toast({ message, type = "error", onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  };

  const themes = {
    error: "border-red-500/20 bg-red-950/45 text-red-200 shadow-[0_8px_32px_rgba(239,68,68,0.15)]",
    success: "border-emerald-500/20 bg-emerald-950/45 text-emerald-200 shadow-[0_8px_32px_rgba(16,185,129,0.15)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-sm w-[calc(100vw-32px)] md:w-auto ${themes[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium flex-1 line-clamp-2">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-white/30 hover:text-white/70 focus:outline-none focus:ring-1 focus:ring-white/20"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
