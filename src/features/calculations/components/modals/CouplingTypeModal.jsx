import { useState, useEffect } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";

export function CouplingTypeModal({ isOpen, onClose, couplingIndex, onSelect }) {
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isOpen) setSelectedCaseId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  // The coupling level is index + 1 (e.g., index 0 is H1)
  const levelName = `H${couplingIndex + 1}`;

  // Generate 10 cases
  const cases = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Case ${i + 1} of Coupling`,
    image: "/images/coupling-case1.svg",
  }));

  const handleNext = () => {
    if (selectedCaseId) {
      const selectedCase = cases.find(c => c.id === selectedCaseId);
      onSelect(selectedCase);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 sm:px-8 sm:py-6 shrink-0">
          <h2 className="text-white font-bold text-base sm:text-lg">
            Coupling Type Selection
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <p className="text-slate-600 text-sm sm:text-base mb-6 font-medium">
            Please select the appropriate coupling type for {levelName}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cases.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`group relative flex flex-col bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#3399cc]/50 focus:ring-offset-2
                    ${isSelected 
                      ? "border-[#3399cc] shadow-md ring-1 ring-[#3399cc]" 
                      : "border-slate-200 hover:border-[#3399cc] hover:shadow-sm"
                    }`}
                >
                  <div className="w-full bg-slate-50/30 border-b border-slate-100 p-4 flex items-center justify-center aspect-square relative">
                    <img
                      src={c.image}
                      alt={c.title}
                      className={`object-contain w-full h-full transition-all duration-200 ${isSelected ? 'opacity-100 scale-105' : 'opacity-70 group-hover:opacity-100'}`}
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-[#3399cc] bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className={`text-xs md:text-sm font-bold text-center transition-colors
                      ${isSelected ? "text-[#0d3b66]" : "text-slate-700 group-hover:text-[#3399cc]"}`}
                    >
                      {c.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-5 sm:px-8 border-t border-slate-200 flex justify-end items-center gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedCaseId}
            className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
