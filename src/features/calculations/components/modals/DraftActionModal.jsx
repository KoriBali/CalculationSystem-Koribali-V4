import { FileWarning } from "lucide-react";
import { createPortal } from "react-dom";

export function DraftActionModal({ open, onClose, onSave, onDiscard }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div className="relative w-full max-w-xs sm:max-w-[500px] bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        
        <div className="flex flex-col items-center text-center">
          {/* Warning icon */}
          <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-amber-100 rounded-full">
            <FileWarning className="w-5 h-5 sm:w-8 sm:h-8 text-amber-500" />
          </div>

          {/* Title */}
          <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
            Unsaved Changes
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
            Do you want to save the changes you made to this calculation? <br className="hidden sm:block" />
            If you select <strong>"Don't Save"</strong>, your changes will be discarded.
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
            {/* Cancel */}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>

            {/* Don't Save */}
            <button
              onClick={onDiscard}
              className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-red-50 text-red-600 border border-red-200 rounded-md sm:rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              Don't Save
            </button>

            {/* Save */}
            <button
              onClick={onSave}
              className="flex-1 py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-[#0d3b66] text-white rounded-md sm:rounded-lg hover:bg-[#154c80] transition-colors"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
