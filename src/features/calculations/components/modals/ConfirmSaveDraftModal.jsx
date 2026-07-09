import { AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";

// Shown when the user tries to leave with unsaved calculation data.
// Gives three choices: stay (Cancel), lose changes (Discard), or keep them (Save Draft).
export const ConfirmSaveDraftModal = ({
  open, // boolean => controls visibility
  onClose, // fn => called when user cancels (stay on page)
  onSaveDraft, // fn => called when user wants to save as draft
  onDiscard, // fn => called when user wants to discard changes
}) => {
  // Don't render if modal is closed
  if (!open) return null;

  return createPortal(
    // Backdrop

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div
        className="
        w-full max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl p-4
        sm:max-w-md sm:p-8 sm:rounded-2xl
      "
      >
        {/* Warning icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-yellow-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500" />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
          Unsaved Changes
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          You have unsaved calculation data. Do you want to save this
          configuration as a draft before leaving?
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
          {/* Discard => leaves without saving */}
          <button
            onClick={() => {
              onDiscard();
              onClose();
            }}
            className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-red-50 text-red-600 border border-red-200 rounded-md sm:rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
          >
            Discard
          </button>

          {/* Cancel => stays on the page, no changes */}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          {/* Save Draft => saves then leaves */}
          <button
            onClick={() => {
              onSaveDraft();
              onClose();
            }}
            className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-[#0d3b66] text-white rounded-md sm:rounded-lg hover:bg-[#154c80] transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
