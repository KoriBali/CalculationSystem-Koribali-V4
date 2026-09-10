/**
 * ExternalObjectModal.jsx
 *
 * Displays EO (External Object) options for CP1 and/or CP2.
 *
 * Props (new nested format — aligned with CouplingCaseFormModal refactor):
 *   cp1Eo          { bushing, terminalCap, nipple, other, otherText }
 *   cp2Eo          { bushing, terminalCap, nipple, other, otherText }
 *   cp1VerticalAngle  number | string
 *   cp2VerticalAngle  number | string
 *   cp1RequiresEo  boolean
 *   cp2RequiresEo  boolean
 *   location       region code ("east_japan" | "west_japan")
 *   eo             EO helpers from useCouplingMasterData
 *   onSave         ({ cp1Eo, cp2Eo }) => void
 */

import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { emptyEO } from "../../utils/resolveExternalObjects";

// ─── Single-CP EO section ────────────────────────────────────────────────────

function CpEoSection({ title, eoState, onChange, verticalAngle, location, eo, hasError, errorMsg }) {
  const visibleOptions = eo.visibleOptions(verticalAngle, location);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={`flex flex-col gap-4 p-4 md:p-5 rounded-xl border bg-white shadow-sm transition-colors ${hasError ? "border-red-500" : "border-gray-200"}`}>
        <h4 className="font-bold text-[#0d3b66] border-b border-gray-100 pb-2 text-sm md:text-base">
          {title}
        </h4>

        <div className="flex flex-col gap-3">
          {visibleOptions.map((opt) => {
            const forced = eo.isForced(opt.id, verticalAngle, location);
            const isChecked = forced || !!eoState[opt.id];

            return (
              <div key={opt.id} className="flex flex-col gap-2">
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    forced
                      ? "border-[#3399cc] bg-blue-50/50 shadow-sm opacity-80 cursor-default"
                      : isChecked
                        ? "border-[#3399cc] bg-blue-50/50 shadow-sm cursor-pointer"
                        : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                      isChecked ? "bg-[#3399cc] border-[#3399cc]" : "bg-white border-gray-300"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${isChecked ? "text-[#0d3b66]" : "text-gray-700"}`}>
                    {opt.label}
                  </span>

                  <input
                    type="checkbox"
                    className="hidden"
                    disabled={forced}
                    checked={isChecked}
                    onChange={(e) => onChange(opt.id, e.target.checked)}
                  />
                </label>

                {/* "Other" text input */}
                {opt.id === "other" && isChecked && (
                  <div className="w-full flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                      type="text"
                      placeholder="Specify other object..."
                      value={eoState.otherText || ""}
                      onChange={(e) => onChange("otherText", e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border outline-none transition-all border-gray-300 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] bg-white"
                    />
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
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export function ExternalObjectModal({
  isOpen,
  onClose,
  onSave,
  cp1Eo,
  cp2Eo,
  cp1VerticalAngle,
  cp2VerticalAngle,
  cp1RequiresEo,
  cp2RequiresEo,
  location,
  eo,
}) {
  const [localCp1Eo, setLocalCp1Eo] = useState(emptyEO());
  const [localCp2Eo, setLocalCp2Eo] = useState(emptyEO());
  const [errors, setErrors] = useState({});

  // Hydrate local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCp1Eo(cp1Eo ? { ...cp1Eo } : emptyEO());
      setLocalCp2Eo(cp2Eo ? { ...cp2Eo } : emptyEO());
      setErrors({});
    }
  }, [isOpen, cp1Eo, cp2Eo]);

  // `eo` is the master-data-backed helper set; without it there is nothing to render.
  if (!isOpen || !eo) return null;

  const handleCp1Change = (field, value) => {
    setLocalCp1Eo((prev) => ({ ...prev, [field]: value }));
    if (errors.cp1) setErrors((prev) => ({ ...prev, cp1: null }));
  };

  const handleCp2Change = (field, value) => {
    setLocalCp2Eo((prev) => ({ ...prev, [field]: value }));
    if (errors.cp2) setErrors((prev) => ({ ...prev, cp2: null }));
  };

  // Validate: at least one option must be (effectively) selected per required CP
  const validate = () => {
    const newErrors = {};
    const checkCp = (eoState, verticalAngle, errorKey, label) => {
      const visible = eo.visibleOptions(verticalAngle, location);
      const hasAny = visible.some((opt) => {
        if (eo.isForced(opt.id, verticalAngle, location)) return true;
        return !!eoState[opt.id];
      });
      if (!hasAny) {
        newErrors[errorKey] = `Please select at least one option for ${label}`;
      }
      if (eoState.other && !eoState.otherText?.trim()) {
        newErrors[`${errorKey}_otherText`] = "Please specify the other object";
      }
    };

    if (cp1RequiresEo) checkCp(localCp1Eo, cp1VerticalAngle, "cp1", "Coupling 1");
    if (cp2RequiresEo) checkCp(localCp2Eo, cp2VerticalAngle, "cp2", "Coupling 2");

    return newErrors;
  };

  const handleSaveClick = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Apply auto-resolved overrides before saving
    const resolvedCp1Eo = cp1RequiresEo
      ? { ...localCp1Eo, ...eo.resolve(cp1VerticalAngle, location) }
      : { ...localCp1Eo };

    const resolvedCp2Eo = cp2RequiresEo
      ? { ...localCp2Eo, ...eo.resolve(cp2VerticalAngle, location) }
      : { ...localCp2Eo };

    onSave({ cp1Eo: resolvedCp1Eo, cp2Eo: resolvedCp2Eo });
  };

  const isDualLayout = cp1RequiresEo && cp2RequiresEo;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl w-full ${isDualLayout ? "max-w-4xl" : "max-w-lg"} shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200`}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#0d3b66] to-[#1a5a92]">
          <h2 className="text-base sm:text-lg font-bold text-white">
            External Object Input at Coupling
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className={`grid ${isDualLayout ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
            {cp1RequiresEo && (
              <CpEoSection
                title="External Object at Coupling 1"
                eoState={localCp1Eo}
                onChange={handleCp1Change}
                verticalAngle={cp1VerticalAngle}
                location={location}
                eo={eo}
                hasError={!!errors.cp1}
                errorMsg={errors.cp1}
              />
            )}
            {cp2RequiresEo && (
              <CpEoSection
                title="External Object at Coupling 2"
                eoState={localCp2Eo}
                onChange={handleCp2Change}
                verticalAngle={cp2VerticalAngle}
                location={location}
                eo={eo}
                hasError={!!errors.cp2}
                errorMsg={errors.cp2}
              />
            )}
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
