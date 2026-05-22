import { AlertCircle } from "lucide-react";

// Asks the user to confirm before disabling one or more components.
// `data` is an array of component names to be disabled => if null/empty, modal won't render.
export const ConfirmDisableModal = ({ data, onClose, onConfirm }) => {
  // Don't render if there's nothing to disable
  if (!data) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-base text-gray-900 mb-2">
          Disable Components?
        </h2>

        {/* Description => lists all components that will be disabled */}
        <p className="text-center text-gray-600 text-sm mb-6">
          You are about to disable:
          <div className="flex flex-wrap justify-center gap-2 my-3">
            {data.map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
          All related data will be permanently deleted.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {/* Cancel - closes without any changes */}
          <button
            onClick={onClose}
            className="flex-1 py-3 font-bold text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          {/* Confirm - proceeds with disabling */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 font-bold text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Yes, Disable
          </button>
        </div>
      </div>
    </div>
  );
};
