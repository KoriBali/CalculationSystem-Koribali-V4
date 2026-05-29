import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

// Confirmation modal shown before logging out
export function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
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
            className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl w-full max-w-xs sm:max-w-md border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              {/* Warning icon */}
              <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
                <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
              </div>

              {/* Title */}
              <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                Confirm Logout
              </h2>

              {/* Description */}
              <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                Are you sure you want to end your current session?
              </p>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3 w-full">
                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                {/* Confirm logout */}
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition-colors"
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
