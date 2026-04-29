import { X } from "lucide-react";
import { CoverForm } from "../forms/cover/CoverForm";

// Reusable modal all state is controlled by the parent.
// Can be used from any page by passing the required props.
export const CoverFormModal = ({
  open,
  onClose,
  coverData,
  onUpdateCoverData,
  onMakeReport,
  coverDataErrors,
}) => {
  // Don't render anything if modal is closed
  if (!open) return null;

  return (
    // Backdrop - coverDatas the full screen with a blurred overlay
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
      {/* Modal card */}
      <div className="bg-white rounded-xl md:rounded-3xl shadow-xl md:shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-fadeIn">
        {/* Header - gradient bar with title and close button */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-2 md:px-4 py-[8px] md:py-4 flex items-center justify-between">
          <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <h2 className="text-white font-semibold md:font-bold text-xs md:text-[16px]">
              Cover Information
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X className="w-5 md:w-6 h-5 md:h-6" />
          </button>
        </div>

        {/* Body - scrollable area that holds the cover form */}
        <div className="p-2 md:p-6 max-h-[75vh] overflow-y-auto">
          <CoverForm
            coverData={coverData}
            onUpdate={onUpdateCoverData}
            onMake={onMakeReport}
            errors={coverDataErrors}
          />
        </div>
      </div>
    </div>
  );
};
