import React from "react";
import { Database, FileEdit, ChevronRight, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { isProjectComplete } from "../../utils/coreLogic";

export function FinishCalculationModal({ open, onClose, onSaveDraft, onSaveDatabase, onGenerateReport, isDrawingMode = false }) {
  const { type: projectType } = useParams();
  if (!open) return null;

  const projectComplete = isProjectComplete(projectType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-5 py-4 sm:px-8 sm:py-5">
          <h2 className="text-white font-bold text-base sm:text-lg">
            Finish Calculation
          </h2>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-3 sm:space-y-4">
          <p className="text-slate-600 text-sm sm:text-base mb-1 sm:mb-2">
            Calculation completed. What would you like to do next?
          </p>

          <button
            onClick={onGenerateReport}
            className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              {isDrawingMode ? (
                <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                {isDrawingMode ? "Preview Drawing Output" : "Generate Report (Preview)"}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                {isDrawingMode ? "Preview the AutoCAD drawing output (Coming Soon)." : "Preview results in PDF report format before finalizing."}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
          </button>

          <button
            onClick={projectComplete ? onSaveDatabase : undefined}
            disabled={!projectComplete}
            className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all text-left group
              ${projectComplete 
                ? "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer" 
                : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-80"
              }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors duration-300
              ${projectComplete 
                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white" 
                : "bg-slate-200 text-slate-400"
              }`}
            >
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm transition-colors ${projectComplete ? "text-slate-800 group-hover:text-blue-700" : "text-slate-500"}`}>
                Save to Database
              </h3>
              <p className={`text-[11px] sm:text-xs mt-0.5 leading-snug ${projectComplete ? "text-slate-500" : "text-red-500 font-medium"}`}>
                {projectComplete 
                  ? "Save project permanently without generating a report."
                  : "Please complete all calculation and drawing steps to save to database."}
              </p>
            </div>
            <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors ${projectComplete ? "text-slate-400 group-hover:text-blue-500" : "text-slate-300"}`} />
          </button>

          <button
            onClick={onSaveDraft}
            className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                Save as Draft
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                Keep it as a draft to edit later.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
          </button>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-4 sm:px-8 sm:py-5 border-t border-slate-100 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-xl font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
