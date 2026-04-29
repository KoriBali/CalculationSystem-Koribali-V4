import { X } from "lucide-react";
// Asks the user to confirm before resetting all inputs and results on the calculation page.
// Once confirmed, all form data and calculation results will be permanently cleared.
export const ConfirmResetAllModal = ({
  open, // boolean => controls visibility
  onClose, // fn => called when user cancels
  onReset, // fn => called when user confirms the reset
}) => {
  // Don't render if modal is closed
  if (!open) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        {/* Danger icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
          Reset All Data?
        </h2>

        {/* Description => warns this will clear everything and is irreversible */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          This will remove all form inputs and calculation results. This action
          cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          {/* Cancel => closes without resetting */}
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          {/* Confirm => resets all data then closes */}
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
