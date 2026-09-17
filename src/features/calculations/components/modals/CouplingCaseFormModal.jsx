import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X, AlertTriangle, Image as ImageIcon } from "lucide-react";
import {
  FIELD_META,
  emptyCP,
  pickActiveFields,
  fieldLabel,
} from "../../config/couplingCaseSchema";
import { isTypeRequiresEo } from "../../utils/resolveExternalObjects";
import { ExternalObjectModal } from "./ExternalObjectModal";

// ─── Image loader with skeleton + error state ────────────────────────────────

const ImageLoader = ({ src, alt, className, wrapperClass }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${wrapperClass || "w-full h-full"}`}>
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
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
      />
    </div>
  );
};

// ─── Error message primitive ─────────────────────────────────────────────────

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

// ─── Input style helper ──────────────────────────────────────────────────────

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// ─── Single-CP field renderer ────────────────────────────────────────────────
// Renders all activeFields for one CP by reading FIELD_META (static metadata)
// and fieldOptions (from master data). No if/else on caseId — purely driven
// by the activeFields list.

function CpFields({ cpKey, cpSchema, fieldOptions, values, errors, onChange }) {
  const handleChange = (field, value) => onChange(cpKey, field, value);

  return (
    <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-4 md:gap-y-5">
      {cpSchema.activeFields.map((field) => {
        const meta = FIELD_META[field];
        const label = fieldLabel(cpSchema, field);
        const error = errors[`${cpKey}.${field}`];

        if (meta.inputType === "select") {
          const options = fieldOptions[field] ?? [];
          return (
            <div key={field} className="relative">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                {label}
              </label>
              <div className="relative">
                <select
                  value={values[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`${inputStyle(error)} cursor-pointer appearance-none`}
                >
                  <option value="" disabled>{meta.placeholder}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
              <ErrorStyle show={error} text={error} />
            </div>
          );
        }

        // number input
        return (
          <div key={field} className="relative">
            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={values[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                onWheel={(e) => e.target.blur()}
                placeholder={meta.placeholder}
                className={`${inputStyle(error)} pr-10 xl:pr-12`}
              />
              {meta.unit && (
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  {meta.unit}
                </span>
              )}
            </div>
            <ErrorStyle show={error} text={error} />
          </div>
        );
      })}
    </div>
  );
}

// Merge a saved caseDetails into a complete { cp1, cp2 } form state. The saved
// payload only carries each CP's active fields (and omits cp2 entirely for
// single-CP cases), so every missing field is filled back in from emptyCP() —
// otherwise reopening a saved case reads formData.cp2.eo off undefined.
const hydrateFormData = (saved) => {
  const merge = (cp) => {
    const base = emptyCP();
    if (!cp) return base;
    return { ...base, ...cp, eo: { ...base.eo, ...(cp.eo ?? {}) } };
  };
  return { cp1: merge(saved?.cp1), cp2: merge(saved?.cp2) };
};

// ─── Main modal ──────────────────────────────────────────────────────────────

export function CouplingCaseFormModal({
  isOpen,
  onClose,
  onChangeCase,
  onSave,
  caseData,
  initialData,
  location,
  // From useCouplingMasterData (via CouplingForm) — the backend master data.
  caseSchema,
  fieldOptions,
  eo,
}) {
  // formData is always { cp1: CPState, cp2: CPState }
  // All possible fields exist on every CP — only activeFields are rendered/validated/sent.
  const [formData, setFormData] = useState(() => hydrateFormData(null));
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasViewedEo, setHasViewedEo] = useState(false);
  const [confirmEoModal, setConfirmEoModal] = useState({ isOpen: false, data: null });
  const [showExternalModal, setShowExternalModal] = useState(false);

  // Reset / hydrate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(hydrateFormData(initialData));
      setErrors({});
    } else {
      setHasViewedEo(false);
      setConfirmEoModal({ isOpen: false, data: null });
    }
  }, [isOpen, initialData]);

  if (!isOpen || !caseData) return null;

  // Master data still loading / failed — CouplingForm shows the retry banner,
  // and CouplingTypeModal gates case selection, so this is a rare edge.
  const schema = caseSchema?.[caseData.id];
  if (!schema || !fieldOptions || !eo) return null;

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (cpKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [cpKey]: { ...prev[cpKey], [field]: value },
    }));
    // Clear inline error on change
    const errorKey = `${cpKey}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  // ── Form reset ───────────────────────────────────────────────────────────
  const handleFormReset = () => {
    setFormData(hydrateFormData(null));
    setErrors({});
  };

  // ── Validation ───────────────────────────────────────────────────────────
  // Iterates activeFields from schema — zero magic numbers.
  const validate = () => {
    const newErrors = {};

    const validateCp = (cpKey, cpSchema) => {
      cpSchema.activeFields.forEach((field) => {
        const val = formData[cpKey][field];
        if (val === "" || val === null || val === undefined) {
          newErrors[`${cpKey}.${field}`] = `${fieldLabel(cpSchema, field)} is required`;
        }
      });
    };

    validateCp("cp1", schema.cp1);
    if (schema.hasDualCp && schema.cp2) {
      validateCp("cp2", schema.cp2);
    }

    return newErrors;
  };

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build clean payload using pickActiveFields — only active, properly typed fields
    const payload = {
      caseId: caseData.id,
      cp1: {
        ...pickActiveFields(formData.cp1, schema.cp1.activeFields),
        eo: { ...formData.cp1.eo },
      },
    };

    if (schema.hasDualCp && schema.cp2) {
      payload.cp2 = {
        ...pickActiveFields(formData.cp2, schema.cp2.activeFields),
        eo: { ...formData.cp2.eo },
      };
    }

    // Auto-resolve EO fields based on type, angle, and location
    if (isTypeRequiresEo(formData.cp1.type)) {
      Object.assign(payload.cp1.eo, eo.resolve(formData.cp1.verticalAngle, location));
    }
    if (schema.hasDualCp && isTypeRequiresEo(formData.cp2.type)) {
      Object.assign(payload.cp2.eo, eo.resolve(formData.cp2.verticalAngle, location));
    }

    const requiresEo =
      isTypeRequiresEo(formData.cp1.type) ||
      (schema.hasDualCp && isTypeRequiresEo(formData.cp2.type));

    if (requiresEo && !hasViewedEo) {
      setConfirmEoModal({ isOpen: true, data: payload });
      return;
    }

    onSave(payload);
  };

  // ── EO gate — validate angle before opening EO modal ────────────────────
  const cp1RequiresEo = isTypeRequiresEo(formData.cp1.type);
  const cp2RequiresEo = schema.hasDualCp && isTypeRequiresEo(formData.cp2.type);
  const showExternalObject = cp1RequiresEo || cp2RequiresEo;

  const handleOpenExternalModal = () => {
    if (!showExternalObject) return;
    const tempErrors = { ...errors };
    let canOpen = true;

    if (cp1RequiresEo && (formData.cp1.verticalAngle === "" || formData.cp1.verticalAngle === null)) {
      tempErrors["cp1.verticalAngle"] = "Please enter Vertical Angle first";
      canOpen = false;
    }
    if (cp2RequiresEo && (formData.cp2.verticalAngle === "" || formData.cp2.verticalAngle === null)) {
      tempErrors["cp2.verticalAngle"] = "Please enter Vertical Angle first";
      canOpen = false;
    }

    if (!canOpen) {
      setErrors(tempErrors);
    } else {
      setHasViewedEo(true);
      setShowExternalModal(true);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
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

          {/* Case diagram image */}
          <div className="w-full sm:w-1/2 bg-white rounded-xl border-2 border-slate-200 p-8 flex items-center justify-center min-h-[300px] shadow-sm relative overflow-hidden">
            <ImageLoader
              src={caseData.image}
              alt={caseData.title}
              wrapperClass="w-full h-full"
              className="max-w-[80%] max-h-[300px] object-contain mix-blend-multiply"
            />
          </div>

          {/* Form fields */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6 justify-start">
            {schema.hasDualCp ? (
              <>
                {/* CP1 card */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 xl:p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-[#0d3b66] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3399cc]" />
                    Coupling 1 (CP1)
                  </h4>
                  <CpFields
                    cpKey="cp1"
                    cpSchema={schema.cp1}
                    fieldOptions={fieldOptions}
                    values={formData.cp1}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>

                {/* CP2 card */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 xl:p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-[#0d3b66] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Coupling 2 (CP2)
                  </h4>
                  <CpFields
                    cpKey="cp2"
                    cpSchema={schema.cp2}
                    fieldOptions={fieldOptions}
                    values={formData.cp2}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              /* Single-CP case */
              <CpFields
                cpKey="cp1"
                cpSchema={schema.cp1}
                fieldOptions={fieldOptions}
                values={formData.cp1}
                errors={errors}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-5 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex w-full sm:w-auto items-center gap-3">
            <button
              onClick={() => initialData ? setShowConfirm(true) : onChangeCase()}
              className="flex-1 justify-center sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Change</span> Case
            </button>
            <button
              onClick={handleFormReset}
              className="flex-1 justify-center sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-red-500 bg-white hover:bg-red-50 hover:text-red-600 border border-red-300 transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
            <button
              type="button"
              disabled={!showExternalObject}
              onClick={handleOpenExternalModal}
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

      {/* ── Change Case confirmation modal ───────────────────────────────────── */}
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
                onClick={() => { setShowConfirm(false); onChangeCase(); }}
                className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 transition-all shadow-sm whitespace-nowrap"
              >
                Change Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-EO confirmation modal ────────────────────────────────────────── */}
      {confirmEoModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[320px] sm:max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2">
                Auto-select External Object
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                System will auto-select the required external objects (Terminal Cap / Yupilon Bushing
                {location === "East Japan" ? ", Nipple" : ""}) based on your Vertical Angle
                {location === "East Japan" ? " and Location" : ""}. Would you like to review and add other objects (e.g. Other)?
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

      {/* ── External Object Modal ────────────────────────────────────────────── */}
      <ExternalObjectModal
        isOpen={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        eo={eo}
        cp1Eo={formData.cp1.eo}
        cp2Eo={formData.cp2.eo}
        cp1VerticalAngle={formData.cp1.verticalAngle}
        cp2VerticalAngle={formData.cp2.verticalAngle}
        cp1RequiresEo={cp1RequiresEo}
        cp2RequiresEo={cp2RequiresEo}
        location={location}
        onSave={({ cp1Eo, cp2Eo }) => {
          setFormData((prev) => ({
            cp1: { ...prev.cp1, eo: cp1Eo },
            cp2: { ...prev.cp2, eo: cp2Eo },
          }));
          setShowExternalModal(false);
        }}
      />
    </div>
  );
}
