import { LayoutDashboard, PenTool, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NextStepModal = ({
  isOpen,
  onClose,
  withDrawing,
  projectType,
  draftId,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      {/* Modal card */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-8 py-5 sm:px-10 sm:py-6">
          <h2 className="text-white font-bold text-base sm:text-lg">
            Select Save & Continue
          </h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-5 sm:space-y-6">
          <p className="text-slate-600 text-sm sm:text-base mb-2">
            Where would you like to go next?
          </p>

          {/* Option: Calculation */}
          <button
            onClick={() =>
              handleNavigate(`/calculation/${projectType}/${draftId}/initial`)
            }
            className="w-full flex items-center gap-4 p-4  rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
          >
            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                Calculation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proceed to technical structural inputs.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
          </button>

          {/* Option: Drawing */}
          <button
            onClick={() =>
              withDrawing &&
              handleNavigate(`/calculation/${projectType}/${draftId}/drawing`)
            }
            disabled={!withDrawing}
            className={`w-full flex items-center gap-4 p-4  rounded-xl border transition-all text-left
              ${
                withDrawing
                  ? "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 group cursor-pointer"
                  : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
              }`}
          >
            <div
              className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors duration-300
              ${
                withDrawing
                  ? "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-bold text-sm transition-colors
                ${withDrawing ? "text-slate-800 group-hover:text-blue-700" : "text-slate-500"}`}
              >
                Drawing
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {withDrawing
                  ? "Proceed to drawing configuration."
                  : "Drawing is disabled in Project Setup."}
              </p>
            </div>
            {withDrawing && (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-5 sm:px-10 border-t border-slate-100 flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-2.5 rounded-xl font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
