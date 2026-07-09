import { useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { createPortal } from "react-dom";

// Displays a dismissible alert message overlaying the screen.
// `toast` carries the message to show => if null, modal won't render.
export const ToastModal = ({
  toast, // { message: string, type?: "success" | "error" } | null => the alert content
  onClose, // fn => called when user dismisses
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

  // Don't render if there's no toast
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return createPortal(
    // Container
    <div className={`fixed z-[60] flex transition-opacity duration-300 ${isSuccess
      ? "top-36 right-4 sm:top-44 sm:right-10 pointer-events-none"
      : "inset-0 items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
      }`}>
      {/* Modal / Toast card */}
      <div
        className={`
        bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]
        transform transition-all duration-300 animate-fadeIn
        ${isSuccess
            ? "w-auto px-4 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-2.5 pointer-events-auto scale-100 border border-green-100"
            : "w-full max-w-xs sm:max-w-fit rounded-2xl sm:rounded-3xl p-4 sm:p-7 scale-100 sm:scale-95"
          }
      `}
      >
        {/* Icon + message row */}
        <div className={`flex items-center gap-3 ${!isSuccess ? "mb-4 sm:mb-6" : ""}`}>
          {/* Dynamic icon */}
          <div className={`flex-shrink-0 flex items-center justify-center border ${isSuccess
            ? "w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-green-50 text-green-500 border-green-300"
            : "w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-yellow-50 text-yellow-500 border-yellow-300"
            }`}>
            {isSuccess ? (
              <CheckCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            ) : (
              <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
            )}
          </div>

          {/* Alert message */}
          <p className={`text-gray-700 font-semibold leading-snug whitespace-nowrap ${isSuccess ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
            {toast.message}
          </p>
        </div>

        {/* Dismiss button - ONLY FOR ERRORS */}
        {!isSuccess && (
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 sm:px-6 sm:py-3 rounded-md sm:rounded-lg border text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
