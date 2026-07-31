import { Check } from "lucide-react";
import { useState, useEffect } from "react";

const OPTIONS = [
  { id: "bushing", label: "Yupilon Bushing (ユーピロンブッシング)" },
  { id: "terminalCap", label: "Terminal Cap (ターミナルキャップ)" },
  { id: "nipple", label: "Nipple (ニップル)" },
  { id: "other", label: "Other" },
];

export function ExternalObjectModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  cp1RequiresEo, 
  cp2RequiresEo,
  location
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (prefix, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`${prefix}${field}`]: value
    }));
    
    // Clear related error
    if (errors[`${prefix}error`]) {
      setErrors(prev => ({ ...prev, [`${prefix}error`]: null }));
    }
  };

  const handleSaveClick = () => {
    const newErrors = {};
    const isAngleZero = (angle) => angle === 0 || angle === "0";

    // Only validate against visible options
    // Note: bushing and terminalCap are now auto-enforced, so they might not need manual selection
    const visibleOptions = OPTIONS.filter(opt => !(opt.id === "nipple" && location === "West Japan"));

    // Validate CP1
    if (cp1RequiresEo) {
      const isZ1 = isAngleZero(formData.verticalAngle);
      const activeOptions = visibleOptions.filter(opt => !(isZ1 && opt.id === "bushing") && !(!isZ1 && opt.id === "terminalCap"));
      
      const hasAnySelected = activeOptions.some(opt => {
        if (isZ1 && opt.id === "terminalCap") return true;
        if (!isZ1 && opt.id === "bushing") return true;
        return formData[`eo_${opt.id}`];
      });

      if (!hasAnySelected) {
        newErrors.eo_error = "Please select at least one option for Coupling 1";
      }
      if (formData.eo_other && !formData.eo_otherText?.trim()) {
        newErrors.eo_otherText = "Please specify the other object";
      }
    }

    // Validate CP2
    if (cp2RequiresEo) {
      const isZ2 = isAngleZero(formData.cp2_verticalAngle);
      const activeOptions = visibleOptions.filter(opt => !(isZ2 && opt.id === "bushing") && !(!isZ2 && opt.id === "terminalCap"));
      
      const hasAnySelected = activeOptions.some(opt => {
        if (isZ2 && opt.id === "terminalCap") return true;
        if (!isZ2 && opt.id === "bushing") return true;
        return formData[`cp2_eo_${opt.id}`];
      });
      if (!hasAnySelected) {
        newErrors.cp2_eo_error = "Please select at least one option for Coupling 2";
      }
      if (formData.cp2_eo_other && !formData.cp2_eo_otherText?.trim()) {
        newErrors.cp2_eo_otherText = "Please specify the other object";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSave = { ...formData };
    
    // Auto-fill values based on vertical angle
    if (cp1RequiresEo) {
      const isZ1 = isAngleZero(formData.verticalAngle);
      dataToSave.eo_terminalCap = isZ1;
      dataToSave.eo_bushing = !isZ1;
    }
    
    if (cp2RequiresEo) {
      const isZ2 = isAngleZero(formData.cp2_verticalAngle);
      dataToSave.cp2_eo_terminalCap = isZ2;
      dataToSave.cp2_eo_bushing = !isZ2;
    }

    if (location === "West Japan") {
      dataToSave.eo_nipple = false;
      dataToSave.cp2_eo_nipple = false;
    } else if (location === "East Japan") {
      if (cp1RequiresEo) dataToSave.eo_nipple = true;
      if (cp2RequiresEo) dataToSave.cp2_eo_nipple = true;
    }

    onSave(dataToSave);
  };

  const renderCpSection = (title, prefix, required, hasError, errorMsg, angle) => {
    if (!required) return null;
    
    const isZ = angle === 0 || angle === "0";
    
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className={`flex flex-col gap-4 p-4 md:p-5 rounded-xl border bg-white shadow-sm transition-colors ${hasError ? 'border-red-500' : 'border-gray-200'}`}>
          <h4 className="font-bold text-[#0d3b66] border-b border-gray-100 pb-2 text-sm md:text-base">
            {title}
          </h4>

          <div className="flex flex-col gap-3">
          {OPTIONS.filter(opt => {
            if (opt.id === "nipple" && location === "West Japan") return false;
            if (isZ && opt.id === "bushing") return false;
            if (!isZ && opt.id === "terminalCap") return false;
            return true;
          }).map(opt => {
            let isForced = false;
            if (isZ && opt.id === "terminalCap") isForced = true;
            if (!isZ && opt.id === "bushing") isForced = true;
            if (location === "East Japan" && opt.id === "nipple") isForced = true;
            
            const isChecked = isForced || !!formData[`${prefix}${opt.id}`];
            
            return (
              <div key={opt.id} className="flex flex-col gap-2">
                <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  isForced
                    ? "border-[#3399cc] bg-blue-50/50 shadow-sm opacity-80 cursor-default"
                    : isChecked 
                        ? "border-[#3399cc] bg-blue-50/50 shadow-sm cursor-pointer" 
                        : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"
                }`}>
                  <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    isChecked ? "bg-[#3399cc] border-[#3399cc]" : "bg-white border-gray-300"
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${isChecked ? "text-[#0d3b66]" : "text-gray-700"}`}>
                    {opt.label}
                  </span>
                  
                  {/* Invisible checkbox for accessibility */}
                  <input 
                    type="checkbox" 
                    className="hidden"
                    disabled={isForced}
                    checked={isChecked}
                    onChange={(e) => handleChange(prefix, opt.id, e.target.checked)}
                  />
                </label>

                {opt.id === "other" && isChecked && (
                  <div className="w-full flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                      type="text"
                      placeholder="Specify other object..."
                      value={formData[`${prefix}otherText`] || ""}
                      onChange={(e) => handleChange(prefix, "otherText", e.target.value)}
                      className={`w-full text-sm p-2.5 rounded-lg border outline-none transition-all ${
                        errors[`${prefix}otherText`] 
                          ? "bg-white border-red-500" 
                          : "bg-white border-gray-300 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
                      }`}
                    />
                    {errors[`${prefix}otherText`] && (
                      <div className="flex items-center pl-1 text-[11px] text-red-500">
                        <span>*{errors[`${prefix}otherText`]}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {hasError && (
        <div className="flex items-center pl-1 text-[11px] text-red-500">
          <span>*{errorMsg}</span>
        </div>
      )}
    </div>
    );
  };

  const isDualLayout = cp1RequiresEo && cp2RequiresEo;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl w-full ${isDualLayout ? 'max-w-4xl' : 'max-w-lg'} shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#0d3b66] to-[#1a5a92]">
          <h2 className="text-base sm:text-lg font-bold text-white">
            External Object Input at Coupling
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className={`grid ${isDualLayout ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {renderCpSection("External Object at Coupling 1", "eo_", cp1RequiresEo, errors.eo_error, errors.eo_error, formData.verticalAngle)}
            {renderCpSection("External Object at Coupling 2", "cp2_eo_", cp2RequiresEo, errors.cp2_eo_error, errors.cp2_eo_error, formData.cp2_verticalAngle)}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-8 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm transition-all"
          >
            Save Objects
          </button>
        </div>
        
      </div>
    </div>
  );
}
