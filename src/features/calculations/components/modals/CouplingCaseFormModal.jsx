import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";

const POSITIONS = ["front", "right", "back", "left"];
const SIZES = ["#16", "#22", "#28", "#36", "#42", "#54", "#70"];
const TYPES = ["JIS", "standard", "short", "long"];

export function CouplingCaseFormModal({ 
  isOpen, 
  onClose, 
  onChangeCase, 
  onSave, 
  caseData,
  initialData 
}) {
  const [formData, setFormData] = useState({
    position: "",
    size: "",
    type: "",
    verticalAngle: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          position: "",
          size: "",
          type: "",
          verticalAngle: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen || !caseData) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFormReset = () => {
    setFormData({
      position: "",
      size: "",
      type: "",
      verticalAngle: ""
    });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.position) newErrors.position = true;
    if (!formData.size) newErrors.size = true;
    if (!formData.type) newErrors.type = true;
    if (formData.verticalAngle === "" || formData.verticalAngle === null) newErrors.verticalAngle = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      caseId: caseData.id,
      ...formData,
      verticalAngle: Number(formData.verticalAngle)
    });
  };

  const inputStyle = (hasError) =>
    `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]
    ${hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
    }`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 sm:px-8 sm:py-6 shrink-0 flex items-center justify-between">
          <h2 className="text-white font-bold text-base sm:text-lg">
            {caseData.title} Form
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50 flex flex-col sm:flex-row gap-8">
          {/* Image */}
          <div className="w-full sm:w-1/2 bg-white rounded-xl border-2 border-slate-200 p-8 flex items-center justify-center min-h-[300px] shadow-sm relative overflow-hidden">
            <img 
              src={caseData.image} 
              alt={caseData.title} 
              className="max-w-[80%] max-h-[300px] object-contain mix-blend-multiply" 
            />
          </div>

          {/* Form */}
          <div className="w-full sm:w-1/2 flex flex-col gap-5 justify-center">
            <div className="relative pb-1">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Position</label>
              <div className="relative">
                <select 
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className={`${inputStyle(errors.position)} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>Select Position</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative pb-1">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Size</label>
              <div className="relative">
                <select 
                  value={formData.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                  className={`${inputStyle(errors.size)} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>Select Size</option>
                  {SIZES.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative pb-1">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Type</label>
              <div className="relative">
                <select 
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={`${inputStyle(errors.type)} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>Select Type</option>
                  {TYPES.map(ty => (
                    <option key={ty} value={ty}>{ty.charAt(0).toUpperCase() + ty.slice(1)}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative pb-1">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Vertical Angle</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  value={formData.verticalAngle}
                  onChange={(e) => handleChange("verticalAngle", e.target.value)}
                  placeholder="e.g. 90"
                  className={inputStyle(errors.verticalAngle)}
                />
                <span className="text-slate-500 font-medium shrink-0">deg</span>
              </div>
            </div>
            
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-xs mt-1 font-medium">* Please fill all required fields.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-5 sm:px-8 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onChangeCase}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Change Case
            </button>
            <button
              onClick={handleFormReset}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-[#0d3b66] bg-[#eef2f6] hover:bg-[#e2e8f0] border border-[#d0d7e2] hover:border-[#b8c2d1] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
            >
              External Object
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
