import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

/**
 * Reusable Input Field Component
 * - Handles label, unit, error, and styling
 */
const InputField = ({
  label,
  value,
  onChange,
  error,
  unit = "mm",
  colSpan = "",
}) => {
  return (
    <div className={`relative ${colSpan}`}>
      <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={onChange}
          onWheel={(e) => e.target.blur()}
          className={`${inputStyle(error)} pr-12`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
          {unit}
        </span>
      </div>

      <ErrorStyle show={error} text={error} />
    </div>
  );
};

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

// Dynamic styling for input fields based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Small component to display validation error messages
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: EightRibTypeForm
 */
export function EightRibTypeForm({
  eightRibType,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  // Clear all dimension input fields
  const handleReset = () => {
    const emptyState = Object.keys(eightRibType).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    onUpdate(emptyState);
  };

  // Helper to bind input change
  const handleChange = (field) => (e) => {
    onUpdate({ [field]: e.target.value });
  };

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        {/* Main content grid: Inputs on the left, Diagrams on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* ================= TOP VIEW : DATA INPUT ================= */}
          <div className="px-4 md:px-5 py-5 rounded-lg md:rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* FIELD : Width of the Baseplate in the EW direction Input */}
              <InputField
                label="Baseplate Width (EW)"
                value={eightRibType.bpWidthEW}
                onChange={handleChange("bpWidthEW")}
                error={errors.bpWidthEW}
              />

              {/* FIELD : Width of the Baseplate in the NS direction Input */}
              <InputField
                label="Baseplate Width (NS)"
                value={eightRibType.bpWidthNS}
                onChange={handleChange("bpWidthNS")}
                error={errors.bpWidthNS}
              />

              {/* FIELD : Anchor pitch in the EW direction Input */}
              <InputField
                label="Anchor Pitch (EW)"
                value={eightRibType.anchorPitchEW}
                onChange={handleChange("anchorPitchEW")}
                error={errors.anchorPitchEW}
              />

              {/* FIELD : Anchor pitch in the NS direction Input */}
              <InputField
                label="Anchor Pitch (NS)"
                value={eightRibType.anchorPitchNS}
                onChange={handleChange("anchorPitchNS")}
                error={errors.anchorPitchNS}
              />

              {/* FIELD : Diameter of Anchor Bolt Input */}
              <InputField
                label="Anchor Bolt Diameter"
                value={eightRibType.anchorDia}
                onChange={handleChange("anchorDia")}
                error={errors.anchorDia}
              />

              {/* FIELD : Number of anchor bolts (n) Input */}
              <InputField
                label="Number of Anchor Bolts (n)"
                value={eightRibType.anchorCount}
                onChange={handleChange("anchorCount")}
                error={errors.anchorCount}
                unit="pcs"
              />

              {/* FIELD : Number of anchor bolts on the tension side (n') Input */}
              <InputField
                label="Number of Anchor Bolts on Tension Side (n')"
                value={eightRibType.anchorCountTension}
                onChange={handleChange("anchorCountTension")}
                error={errors.anchorCountTension}
                unit="pcs"
              />

              {/* FIELD : Rib Angle (θ) */}
              <InputField
                label="Rib Angle (θ)"
                value={eightRibType.ribAngle}
                onChange={handleChange("ribAngle")}
                error={errors.ribAngle}
                unit="deg"
              />
            </div>
          </div>

          {/* ================= RIGHT SECTION: IMAGE TOP VIEW  ================= */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/8rib-topview.png"
              alt="8 rib baseplate top view"
              className="max-h-[250px] object-contain"
            />
          </div>

          {/* ================= SIDE VIEW : DATA INPUT ================= */}
          <div className="px-4 md:px-5 py-5 rounded-lg md:rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* FIELD : Thickness of the Baseplate Input */}
              <InputField
                label="Baseplate Thickness"
                value={eightRibType.bpThickness}
                onChange={handleChange("bpThickness")}
                error={errors.bpThickness}
              />

              {/* FIELD : Height of the Rib Plate Input */}
              <InputField
                label="Rib Plate Height"
                value={eightRibType.ribHeight}
                onChange={handleChange("ribHeight")}
                error={errors.ribHeight}
              />

              {/* FIELD : Rib Plate scallop Input */}
              <InputField
                label="Rib Plate Scallop"
                value={eightRibType.ribScallop}
                onChange={handleChange("ribScallop")}
                error={errors.ribScallop}
              />

              {/* FIELD : Weld leg length Input */}
              <InputField
                label="Weld Leg Length"
                value={eightRibType.weldLeg}
                onChange={handleChange("weldLeg")}
                error={errors.weldLeg}
              />

              {/* FIELD : Length of the Rib Plate Input */}
              <InputField
                label="Rib Plate Length"
                value={eightRibType.ribLength}
                onChange={handleChange("ribLength")}
                error={errors.ribLength}
              />

              {/* FIELD : Thickness of the Rib Plate Input */}
              <InputField
                label="Rib Plate Thickness"
                value={eightRibType.ribThickness}
                onChange={handleChange("ribThickness")}
                error={errors.ribThickness}
              />
            </div>
          </div>

          {/* ================= RIGHT SECTION: IMAGE SIDE VIEW  ================= */}
          <div className="bg-gray-50 border rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/8rib-sideview.png"
              alt="8 rib baseplate side view"
              className="max-h-[150px] object-contain"
            />
          </div>
        </div>

        {/* ================= FOOTER SECTION: ACTIONS ================= */}
        <div className="flex justify-between items-center mt-6 pt-4 md:pt-6 border-t border-gray-200">
          {/* Reset button to clear all inputs */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-[22px] md:px-7 py-[10px] md:py-2.5 bg-[#eef2f6] text-[#0d3b66] text-xs md:text-sm
            border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium"
          >
            <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
            Reset
          </button>

          <div className="flex items-center gap-3">
            {/* Button to trigger calculations */}
            <button
              onClick={onCalculate}
              className="flex items-center gap-2 px-7 py-2.5
              border border-[#cbd5e1] text-[#0d3b66]
              rounded-lg text-sm hover:bg-[#f1f5f9] transition-all font-medium"
            >
              <Calculator className="w-4 md:w-5 h-4 md:h-5" />
              Calculate
            </button>

            {/* Proceed to next step or report generation */}
            <button
              onClick={onNext}
              disabled={!isCalculated}
              className={`
                flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-medium
                transition-all
                ${
                  !isCalculated
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }
              `}
            >
              {buttonLabel}
              <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
