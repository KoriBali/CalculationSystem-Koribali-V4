import { AlertCircle } from "lucide-react";

// Asks the user to confirm before reducing the count of an item.
// `open` doubles as the visibility flag and carries { from, to } range data.
export const ConfirmReduceModal = ({
  open, // { from, to } | false => controls visibility + holds range values
  onClose, // fn => called when user cancels
  onConfirm, // fn => called when user confirms the reduction
  itemName = "", // string => name of the item being reduced
}) => {
  // Don't render if modal is closed
  if (!open) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8"
      >
        {/* Danger icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title => includes the item name for clarity */}
        <h2
          id="modal-title"
          className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2"
        >
          Reduce {itemName}?
        </h2>

        {/* Description => shows the from → to range and warns about data loss */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
          You are about to reduce {itemName} from <strong>{open.from}</strong>{" "}
          to <strong>{open.to}</strong>. The last {itemName} will be permanently
          removed.
        </p>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          {/* Cancel => closes without reducing */}
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>

          {/* Confirm => proceeds with the reduction */}
          <button
            onClick={onConfirm}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
