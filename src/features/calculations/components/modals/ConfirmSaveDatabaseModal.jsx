import { Database } from "lucide-react";
import { createPortal } from "react-dom";

export const ConfirmSaveDatabaseModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transform transition-all animate-fadeIn">
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-blue-50 rounded-full border border-blue-100">
          <Database className="w-5 h-5 sm:w-8 sm:h-8 text-[#0d3b66]" />
        </div>

        <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
          Save Project to Database?
        </h2>

        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          Are you sure you want to permanently save this project to the database? Ensure all calculations are final.
        </p>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-[#0d3b66] text-white rounded-md sm:rounded-lg hover:bg-[#154c80] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
