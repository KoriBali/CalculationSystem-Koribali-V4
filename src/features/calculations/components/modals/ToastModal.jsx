import { useEffect } from "react";
import { AlertCircle, Check } from "lucide-react";
import { createPortal } from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Displays a dismissible alert message overlaying the screen.
export const ToastModal = ({
  toast, // { message: string, type?: "success" | "error" } | null
  onClose,
}) => {
  // Auto-dismiss for success toasts
  useEffect(() => {
    if (toast && toast.type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return createPortal(
    <AnimatePresence>
      {toast && (
        <div className="fixed z-[1000] flex inset-0 items-center justify-center px-4">
          {/* Blurred backdrop — click anywhere to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              relative bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]
              ${toast.type === "success"
                ? "w-full max-w-[280px] sm:max-w-[340px] rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center"
                : "w-full max-w-xs sm:max-w-fit rounded-2xl sm:rounded-3xl p-4 sm:p-7"
              }
            `}
          >
            {toast.type === "success" ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center relative"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                  >
                    <Check className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 stroke-[3]" />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-800 font-bold text-lg sm:text-xl mb-2"
                >
                  Success!
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 font-medium text-sm sm:text-base"
                >
                  {toast.message}
                </motion.p>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 text-center sm:text-left">
                  <div className="flex-shrink-0 flex items-center justify-center border w-12 h-12 rounded-xl bg-amber-50 text-amber-500 border-amber-300 mx-auto sm:mx-0">
                    <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex flex-col justify-center min-h-[48px]">
                    {toast.title && (
                      <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-1">
                        {toast.title}
                      </h4>
                    )}
                    <p className="text-slate-700 font-medium leading-relaxed text-xs sm:text-sm">
                      {toast.message}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end mt-2">
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 bg-[#0d3b66] text-white hover:bg-[#092b4d] cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
