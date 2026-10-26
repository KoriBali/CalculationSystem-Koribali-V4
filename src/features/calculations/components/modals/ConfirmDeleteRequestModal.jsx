import React, { useState, useEffect } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

/**
 * Confirmation modal matching the project's Add/Edit Case modal typography and layout style,
 * with clean red theme and no white borders on badges or outer frame.
 */
export function ConfirmDeleteRequestModal({
  isOpen,
  request,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  const [typedConfirmation, setTypedConfirmation] = useState("");

  // Target string that the user must type to confirm
  const targetText =
    request?.requestNo ||
    request?.fields?.requestNo ||
    request?.pjNo ||
    request?.fields?.projectNo ||
    "";

  const isMatch =
    typedConfirmation.trim() === targetText.trim() && targetText.length > 0;

  // Reset input whenever modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation("");
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMatch && !isDeleting) {
      onConfirm(request);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={!isDeleting ? onClose : undefined}
    >
      <div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Header (Matching Add/Edit Case Modal style, Red theme, No close X button) */}
        <div className="bg-gradient-to-r from-[#b91c1c] to-[#991b1b] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3
                id="delete-modal-title"
                className="text-base font-semibold text-white"
              >
                Delete Request
              </h3>
              <p className="text-xs text-red-100/80 font-normal">
                This action is destructive and cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Warning Message Box - Clean, no white border */}
            <div className="rounded-xl bg-red-50/70 border border-red-100 p-4 text-xs text-red-950 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-950 mb-1 text-xs md:text-sm">
                    Are you sure you want to delete this request?
                  </p>
                  <p className="text-slate-600 text-xs md:text-[13px] leading-relaxed">
                    Deleting request{" "}
                    <strong className="font-semibold text-red-700">{targetText}</strong>{" "}
                    will permanently remove all of its calculation cases, drawings,
                    and associated attachments.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Input - Typography and style identical to Add Case modal */}
            <div>
              <label
                htmlFor="confirm-delete-input"
                className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium"
              >
                Confirm Request No. <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm-delete-input"
                type="text"
                autoFocus
                disabled={isDeleting}
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                placeholder={`Type "${targetText}" to confirm`}
                className="w-full py-2.5 px-3.5 rounded-lg border border-slate-300 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Type <span className="font-semibold text-red-600">{targetText}</span> to enable the delete button
              </p>
            </div>
          </div>

          {/* Modal Actions Footer - Matching Add Case Modal layout & button styling */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-2xl shrink-0">
            <span className="text-xs md:text-sm text-slate-500">
              Cannot be undone
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isMatch || isDeleting}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmDeleteRequestModal;
