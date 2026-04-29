import { AlertCircle } from "lucide-react";

// Displays a dismissible alert message overlaying the screen.
// `toast` carries the message to show => if null, modal won't render.
export const ToastModal = ({
  toast, // { message: string } | null => the alert content
  onClose, // fn => called when user dismisses
}) => {
  // Don't render if there's no toast
  if (!toast) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 transition-opacity duration-300">
      {/* Modal card */}
      <div
        className="
        bg-white w-full max-w-xs sm:max-w-fit
        rounded-2xl sm:rounded-3xl
        shadow-[0_10px_40px_rgba(0,0,0,0.15)]
        p-4 sm:p-7
        transform transition-all duration-300 scale-100 sm:scale-95 animate-fadeIn
      "
      >
        {/* Icon + message row */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {/* Warning icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-yellow-50 text-yellow-500 border border-yellow-300">
            <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          {/* Alert message */}
          <p className="text-gray-700 text-xs sm:text-[16px] font-semibold leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Dismiss button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-md sm:rounded-lg bg-blue-50 border border-blue-500 text-blue-700 text-xs sm:text-sm font-semibold hover:bg-blue-100 transition-all shadow-sm active:scale-95"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
