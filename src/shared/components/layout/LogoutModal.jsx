import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

// Confirmation modal shown before logging out
export function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl max-w-sm w-full border border-slate-100"
          >
            <div className="flex flex-col items-center text-center">
              {/* Warning icon */}
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertCircle size={28} />
              </div>

              {/* Title */}
              <h2 className="text-center font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                Confirm Logout
              </h2>

              {/* Description */}
              <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                Are you sure you want to end your current session?
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-3 px-4 font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md sm:rounded-lg"
                >
                  Cancel
                </button>

                {/* Confirm logout */}
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2 sm:py-3 px-4 font-bold text-xs sm:text-sm text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-200 rounded-md sm:rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
