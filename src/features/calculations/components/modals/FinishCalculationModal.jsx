import React from "react";
import { Database, FileEdit, X } from "lucide-react";

export function FinishCalculationModal({ open, onClose, onSaveDraft, onSaveDatabase }) {
  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white">Save Calculation</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 mb-6">
            You have completed the calculation. How would you like to save your work?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onSaveDraft}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-slate-200 hover:border-[#1a5a92] hover:bg-slate-50 transition group text-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#1a5a92]/10 flex items-center justify-center transition">
                <FileEdit className="w-6 h-6 text-slate-500 group-hover:text-[#1a5a92] transition" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-[#1a5a92] transition">Save as Draft</h3>
                <p className="text-xs text-slate-500 mt-1">Keep it as a draft to edit later</p>
              </div>
            </button>

            <button
              onClick={onSaveDatabase}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-slate-200 hover:border-[#1a5a92] hover:bg-slate-50 transition group text-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#1a5a92]/10 flex items-center justify-center transition">
                <Database className="w-6 h-6 text-slate-500 group-hover:text-[#1a5a92] transition" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-[#1a5a92] transition">Save to Database</h3>
                <p className="text-xs text-slate-500 mt-1">Store it permanently in database</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
