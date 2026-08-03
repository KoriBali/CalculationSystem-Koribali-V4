import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { ExternalObjectModal } from "./ExternalObjectModal";

const ImageLoader = ({ src, alt, className, wrapperClass }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${wrapperClass || 'w-full h-full'}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-slate-300" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-[10px]">Failed to load</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
      />
    </div>
  );
};

const POSITIONS = ["front", "right", "back", "left"];
const SIZES = ["#16", "#22", "#28", "#36", "#42", "#54", "#70"];
const TYPES = ["JIS", "standard", "short", "long"];

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

export function CouplingCaseFormModal({ 
  isOpen, 
  onClose, 
  onChangeCase, 
  onSave, 
  caseData,
  initialData,
  location
}) {
  const [formData, setFormData] = useState({
    position: "",
    size: "",
    type: "",
    verticalAngle: "",
    distance: "",
    horizontalAngle: "",
    cp2_position: "",
    cp2_size: "",
    cp2_type: "",
    cp2_verticalAngle: "",
    horizontalAngle1: "",
    cp2_distance: "",
    cp2_horizontalAngle: "",
    eo_bushing: false,
    eo_terminalCap: false,
    eo_nipple: false,
    eo_other: false,
    eo_otherText: "",
    cp2_eo_bushing: false,
    cp2_eo_terminalCap: false,
    cp2_eo_nipple: false,
    cp2_eo_other: false,
    cp2_eo_otherText: ""
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasViewedEo, setHasViewedEo] = useState(false);
  const [confirmEoModal, setConfirmEoModal] = useState({ isOpen: false, data: null });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          position: "",
          size: "",
          type: "",
          verticalAngle: "",
          distance: "",
          horizontalAngle: "",
          cp2_position: "",
          cp2_size: "",
          cp2_type: "",
          cp2_verticalAngle: "",
          horizontalAngle1: "",
          cp2_distance: "",
          cp2_horizontalAngle: "",
          eo_bushing: false,
          eo_terminalCap: false,
          eo_nipple: false,
          eo_other: false,
          eo_otherText: "",
          cp2_eo_bushing: false,
          cp2_eo_terminalCap: false,
          cp2_eo_nipple: false,
          cp2_eo_other: false,
          cp2_eo_otherText: ""
        });
      }
      setErrors({});
    } else {
      setHasViewedEo(false);
      setConfirmEoModal({ isOpen: false, data: null });
    }
  }, [isOpen, initialData]);

  const [showExternalModal, setShowExternalModal] = useState(false);

  if (!isOpen || !caseData) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleChangeCaseClick = () => {
    if (initialData) {
      setShowConfirm(true);
    } else {
      onChangeCase();
    }
  };

  const handleFormReset = () => {
    setFormData({
      position: "",
      size: "",
      type: "",
      verticalAngle: "",
      distance: "",
      horizontalAngle: "",
      cp2_position: "",
      cp2_size: "",
      cp2_type: "",
      cp2_verticalAngle: "",
      horizontalAngle1: "",
      cp2_distance: "",
      cp2_horizontalAngle: "",
      eo_bushing: false,
      eo_terminalCap: false,
      eo_nipple: false,
      eo_other: false,
      eo_otherText: "",
      cp2_eo_bushing: false,
      cp2_eo_terminalCap: false,
      cp2_eo_nipple: false,
      cp2_eo_other: false,
      cp2_eo_otherText: ""
    });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.position) newErrors.position = "Required field";
    if (!formData.size) newErrors.size = "Required field";
    if (!formData.type) newErrors.type = "Required field";
    if (formData.verticalAngle === "" || formData.verticalAngle === null) newErrors.verticalAngle = "Required field";
    
    if (caseData.id === 4 || caseData.id === 6 || caseData.id === 7 || caseData.id === 8 || caseData.id === 9 || caseData.id === 10) {
      if (!formData.cp2_position) newErrors.cp2_position = "Required field";
      if (!formData.cp2_size) newErrors.cp2_size = "Required field";
      if (!formData.cp2_type) newErrors.cp2_type = "Required field";
      if (formData.cp2_verticalAngle === "" || formData.cp2_verticalAngle === null) newErrors.cp2_verticalAngle = "Required field";
    }

    if (caseData.id === 6 || caseData.id === 8) {
      if (formData.cp2_distance === "" || formData.cp2_distance === null) newErrors.cp2_distance = "Required field";
    }

    if (caseData.id === 7 || caseData.id === 9 || caseData.id === 10) {
      if (formData.cp2_horizontalAngle === "" || formData.cp2_horizontalAngle === null) newErrors.cp2_horizontalAngle = "Required field";
    }

    if ((caseData.id === 2 || caseData.id === 6) && (formData.distance === "" || formData.distance === null)) {
      newErrors.distance = "Required field";
    }
    if ((caseData.id === 3 || caseData.id === 7) && (formData.horizontalAngle === "" || formData.horizontalAngle === null)) {
      newErrors.horizontalAngle = "Required field";
    }
    if (caseData.id === 5) {
      if (formData.horizontalAngle1 === "" || formData.horizontalAngle1 === null) newErrors.horizontalAngle1 = "Required field";
    }

    // External Object selection validation is no longer needed since it's auto-filled based on verticalAngle

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedData = {
      caseId: caseData.id,
      ...formData,
      verticalAngle: Number(formData.verticalAngle)
    };

    const hasDualCp = [4, 6, 7, 8, 9, 10].includes(caseData.id);
    const isTypeRequiresEo = (type) => type && ["standard", "long", "short"].includes(type.toLowerCase());
    const isAngleZero = (angle) => angle === 0 || angle === "0";

    if (isTypeRequiresEo(formData.type)) {
      const isZ1 = isAngleZero(formData.verticalAngle);
      savedData.eo_terminalCap = isZ1;
      savedData.eo_bushing = !isZ1;
      if (location === "West Japan") savedData.eo_nipple = false;
      if (location === "East Japan") savedData.eo_nipple = true;
    }

    if (hasDualCp && isTypeRequiresEo(formData.cp2_type)) {
      const isZ2 = isAngleZero(formData.cp2_verticalAngle);
      savedData.cp2_eo_terminalCap = isZ2;
      savedData.cp2_eo_bushing = !isZ2;
      if (location === "West Japan") savedData.cp2_eo_nipple = false;
      if (location === "East Japan") savedData.cp2_eo_nipple = true;
    }

    if (caseData.id === 4 || caseData.id === 6 || caseData.id === 7 || caseData.id === 8 || caseData.id === 9 || caseData.id === 10) {
      savedData.cp2_verticalAngle = Number(formData.cp2_verticalAngle);
    } else {
      delete savedData.cp2_position;
      delete savedData.cp2_size;
      delete savedData.cp2_type;
      delete savedData.cp2_verticalAngle;
    }

    if (caseData.id === 6 || caseData.id === 8) {
      savedData.cp2_distance = Number(formData.cp2_distance);
    } else {
      delete savedData.cp2_distance;
    }
    
    if (caseData.id === 7 || caseData.id === 9 || caseData.id === 10) {
      savedData.cp2_horizontalAngle = Number(formData.cp2_horizontalAngle);
    } else {
      delete savedData.cp2_horizontalAngle;
    }

    if (caseData.id === 2 || caseData.id === 6) {
      savedData.distance = Number(formData.distance);
    } else {
      delete savedData.distance;
    }

    if (caseData.id === 3 || caseData.id === 7) {
      savedData.horizontalAngle = Number(formData.horizontalAngle);
    } else {
      delete savedData.horizontalAngle;
    }

    if (caseData.id === 5) {
      savedData.horizontalAngle1 = Number(formData.horizontalAngle1);
    } else {
      delete savedData.horizontalAngle1;
    }

    const requiresEo = isTypeRequiresEo(formData.type) || (hasDualCp && isTypeRequiresEo(formData.cp2_type));

    if (requiresEo && !hasViewedEo) {
      setConfirmEoModal({
        isOpen: true,
        data: savedData
      });
      return;
    }

    onSave(savedData);
  };

  const inputStyle = (hasError) =>
    `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]
    ${hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
    }`;

  const renderStandardFields = (prefix = "", labelSuffix = "", isCompact = false, children = null) => (
    <div className={isCompact ? "grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-4 md:gap-y-5" : "flex flex-col gap-6"}>
      <div className="relative">
        <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Position {labelSuffix}</label>
        <div className="relative">
          <select 
            value={formData[`${prefix}position`]}
            onChange={(e) => handleChange(`${prefix}position`, e.target.value)}
            className={`${inputStyle(errors[`${prefix}position`])} cursor-pointer appearance-none`}
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
        <ErrorStyle show={errors[`${prefix}position`]} text={errors[`${prefix}position`]} />
      </div>

      <div className="relative">
        <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Size {labelSuffix}</label>
        <div className="relative">
          <select 
            value={formData[`${prefix}size`]}
            onChange={(e) => handleChange(`${prefix}size`, e.target.value)}
            className={`${inputStyle(errors[`${prefix}size`])} cursor-pointer appearance-none`}
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
        <ErrorStyle show={errors[`${prefix}size`]} text={errors[`${prefix}size`]} />
      </div>

      <div className="relative">
        <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Coupling Type {labelSuffix}</label>
        <div className="relative">
          <select 
            value={formData[`${prefix}type`]}
            onChange={(e) => handleChange(`${prefix}type`, e.target.value)}
            className={`${inputStyle(errors[`${prefix}type`])} cursor-pointer appearance-none`}
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
        <ErrorStyle show={errors[`${prefix}type`]} text={errors[`${prefix}type`]} />
      </div>

      <div className="relative">
        <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Vertical Angle {labelSuffix}</label>
        <div className="relative">
          <input 
            type="number"
            inputMode="decimal"
            value={formData[`${prefix}verticalAngle`]}
            onChange={(e) => handleChange(`${prefix}verticalAngle`, e.target.value)}
            onWheel={(e) => e.target.blur()}
            placeholder="e.g. 90"
            className={`${inputStyle(errors[`${prefix}verticalAngle`])} pr-10 xl:pr-12`}
          />
          <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
            deg
          </span>
        </div>
        <ErrorStyle show={errors[`${prefix}verticalAngle`]} text={errors[`${prefix}verticalAngle`]} />
      </div>
      {children}
    </div>
  );

  const hasDualCp = [4, 6, 7, 8, 9, 10].includes(caseData.id);
  const isValidExternalType = (type) => type && ["standard", "long", "short"].includes(type.toLowerCase());
  const cp1RequiresEo = isValidExternalType(formData.type);
  const cp2RequiresEo = hasDualCp && isValidExternalType(formData.cp2_type);
  const showExternalObject = cp1RequiresEo || cp2RequiresEo;

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
            <ImageLoader 
              src={caseData.image} 
              alt={caseData.title} 
              wrapperClass="w-full h-full"
              className="max-w-[80%] max-h-[300px] object-contain mix-blend-multiply" 
            />
          </div>

          {/* Form */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6 justify-start">
            
            {(caseData.id === 4 || caseData.id === 6 || caseData.id === 7 || caseData.id === 8 || caseData.id === 9 || caseData.id === 10) ? (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-4 xl:p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-[#0d3b66] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3399cc]" />
                    Coupling 1 (CP1)
                  </h4>
                  {renderStandardFields("", "", true, (caseData.id === 6 || caseData.id === 7) && (
                    <div className="relative col-span-2">
                      <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                        {caseData.id === 6 ? "Distance (d)" : "Horizontal Angle (θ)"}
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          inputMode="decimal"
                          value={caseData.id === 6 ? formData.distance : formData.horizontalAngle}
                          onChange={(e) => handleChange(caseData.id === 6 ? "distance" : "horizontalAngle", e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          placeholder={caseData.id === 6 ? "e.g. 100" : "e.g. 90"}
                          className={`${inputStyle(caseData.id === 6 ? errors.distance : errors.horizontalAngle)} pr-10 xl:pr-12`}
                        />
                        <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                          {caseData.id === 6 ? "mm" : "deg"}
                        </span>
                      </div>
                      <ErrorStyle show={caseData.id === 6 ? errors.distance : errors.horizontalAngle} text={caseData.id === 6 ? errors.distance : errors.horizontalAngle} />
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4 xl:p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-[#0d3b66] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Coupling 2 (CP2)
                  </h4>
                  {renderStandardFields("cp2_", "", true, (caseData.id === 6 || caseData.id === 7 || caseData.id === 8 || caseData.id === 9 || caseData.id === 10) && (
                    <div className="relative col-span-2">
                      <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                        {(caseData.id === 6 || caseData.id === 8) ? "Distance (d)" : caseData.id === 10 ? "Horizontal Angle (θ2)" : "Horizontal Angle (θ)"}
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          inputMode="decimal"
                          value={(caseData.id === 6 || caseData.id === 8) ? formData.cp2_distance : formData.cp2_horizontalAngle}
                          onChange={(e) => handleChange((caseData.id === 6 || caseData.id === 8) ? "cp2_distance" : "cp2_horizontalAngle", e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          placeholder={(caseData.id === 6 || caseData.id === 8) ? "e.g. 100" : "e.g. 90"}
                          className={`${inputStyle((caseData.id === 6 || caseData.id === 8) ? errors.cp2_distance : errors.cp2_horizontalAngle)} pr-10 xl:pr-12`}
                        />
                        <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                          {(caseData.id === 6 || caseData.id === 8) ? "mm" : "deg"}
                        </span>
                      </div>
                      <ErrorStyle show={(caseData.id === 6 || caseData.id === 8) ? errors.cp2_distance : errors.cp2_horizontalAngle} text={(caseData.id === 6 || caseData.id === 8) ? errors.cp2_distance : errors.cp2_horizontalAngle} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              renderStandardFields("", "")
            )}

            {caseData.id === 2 && (
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Distance (d)</label>
                <div className="relative">
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={formData.distance}
                    onChange={(e) => handleChange("distance", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="e.g. 100"
                    className={`${inputStyle(errors.distance)} pr-10 xl:pr-12`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.distance} text={errors.distance} />
              </div>
            )}

            {caseData.id === 3 && (
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Horizontal Angle (θ)</label>
                <div className="relative">
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={formData.horizontalAngle}
                    onChange={(e) => handleChange("horizontalAngle", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="e.g. 90"
                    className={`${inputStyle(errors.horizontalAngle)} pr-10 xl:pr-12`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    deg
                  </span>
                </div>
                <ErrorStyle show={errors.horizontalAngle} text={errors.horizontalAngle} />
              </div>
            )}

            {caseData.id === 5 && (
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Horizontal Angle (θ1)</label>
                <div className="relative">
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={formData.horizontalAngle1}
                    onChange={(e) => handleChange("horizontalAngle1", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="e.g. 90"
                    className={`${inputStyle(errors.horizontalAngle1)} pr-10 xl:pr-12`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    deg
                  </span>
                </div>
                <ErrorStyle show={errors.horizontalAngle1} text={errors.horizontalAngle1} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-5 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex w-full sm:w-auto items-center gap-3">
            <button
              onClick={handleChangeCaseClick}
              className="flex-1 justify-center sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Change</span> Case
            </button>
            <button
              onClick={handleFormReset}
              className="flex-1 justify-center sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-[#0d3b66] bg-[#eef2f6] hover:bg-[#e2e8f0] border border-[#d0d7e2] hover:border-[#b8c2d1] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
            <button
              type="button"
              disabled={!showExternalObject}
              onClick={() => {
                if (!showExternalObject) return;

                let canOpen = true;
                const tempErrors = { ...errors };
                const hasDualCp = [4, 6, 7, 8, 9, 10].includes(caseData.id);
                const isTypeRequiresEo = (type) => type && ["standard", "long", "short"].includes(type.toLowerCase());

                if (isTypeRequiresEo(formData.type)) {
                  if (formData.verticalAngle === "" || formData.verticalAngle === null) {
                    tempErrors.verticalAngle = "Please enter Vertical Angle first";
                    canOpen = false;
                  }
                }

                if (hasDualCp && isTypeRequiresEo(formData.cp2_type)) {
                  if (formData.cp2_verticalAngle === "" || formData.cp2_verticalAngle === null) {
                    tempErrors.cp2_verticalAngle = "Please enter Vertical Angle first";
                    canOpen = false;
                  }
                }

                if (!canOpen) {
                  setErrors(tempErrors);
                } else {
                  setHasViewedEo(true);
                  setShowExternalModal(true);
                }
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-center transition-colors ${
                showExternalObject 
                  ? "text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm cursor-pointer" 
                  : "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
              }`}
            >
              External Object {showExternalObject && <span className="text-red-500">*</span>}
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 max-w-[320px] sm:max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center border border-slate-100">
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 sm:mb-4 shrink-0">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-[#3399cc]" />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2">Change Case?</h3>
            
            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 leading-relaxed">
              You already have saved data for this case. Changing the case will discard your current data.
            </p>
            
            <div className="flex w-full gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onChangeCase();
                }}
                className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 transition-all shadow-sm whitespace-nowrap"
              >
                Change Case
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Auto EO Confirm Modal */}
      {confirmEoModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[320px] sm:max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2">Auto-select External Object</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                System will auto-select the required external objects (Terminal Cap / Yupilon Bushing{location === "East Japan" ? ", Nipple" : ""}) based on your Vertical Angle{location === "East Japan" ? " and Location" : ""}. Would you like to review and add other objects (e.g. Other)?
              </p>
            </div>
            <div className="flex bg-slate-50 border-t border-slate-100 p-4 sm:px-6 gap-3 justify-end">
              <button 
                onClick={() => {
                  setConfirmEoModal({ isOpen: false, data: null });
                  setHasViewedEo(true);
                  setShowExternalModal(true);
                }}
                className="px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                Review Objects
              </button>
              <button 
                onClick={() => {
                  onSave(confirmEoModal.data);
                  setConfirmEoModal({ isOpen: false, data: null });
                }}
                className="px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm transition-all whitespace-nowrap"
              >
                Proceed to Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* External Object Modal */}
      <ExternalObjectModal
        isOpen={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        initialData={formData}
        cp1RequiresEo={cp1RequiresEo}
        cp2RequiresEo={cp2RequiresEo}
        location={location}
        onSave={(updatedData) => {
          setFormData(updatedData);
          setShowExternalModal(false);
          // Clear error if there was any
          setErrors(prev => ({ ...prev, type: null, cp2_type: null }));
        }}
      />
    </div>
  );
}
