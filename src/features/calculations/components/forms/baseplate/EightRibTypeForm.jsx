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

      <div className="relative w-fit">
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
 */
const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

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
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center pt-3 xl:pt-0 xl:pr-[160px]">
          {/* ================= TOP VIEW : IMAGE + POSITIONED INPUTS ================= */}
          <div className="relative">
            <img
              src="/images/8Rib-TopView.svg"
              alt="8 rib baseplate top view"
              className="h-[380px] xl:h-[450px] 2xl:h-[450px] object-contain"
            />

            {/* Baseplate Width (EW) — top center */}
            <div className="absolute top-0 xl:top-2 left-[61.3%] xl:left-[59.87%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Baseplate Width (EW)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.bpWidthEW}
                  onChange={handleChange("bpWidthEW")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.bpWidthEW)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.bpWidthEW} text={errors.bpWidthEW} />
            </div>

            {/* Anchor Pitch (EW) — below Baseplate Width (EW) */}
            <div className="absolute top-[23%] xl:top-[25%] left-[59.87%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Anchor Pitch (EW)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.anchorPitchEW}
                  onChange={handleChange("anchorPitchEW")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorPitchEW)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle
                show={errors.anchorPitchEW}
                text={errors.anchorPitchEW}
              />
            </div>

            {/* Baseplate Width (NS) — middle left edge */}
            <div className="absolute top-[71%] -translate-y-1/2 -left-10 xl:-left-12">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Baseplate Width (NS)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.bpWidthNS}
                  onChange={handleChange("bpWidthNS")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.bpWidthNS)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.bpWidthNS} text={errors.bpWidthNS} />
            </div>

            {/* Anchor Pitch (NS) — to the right of Baseplate Width (NS) */}
            <div className="absolute top-[71%] -translate-y-1/2 left-[30%] xl:left-[29%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Anchor Pitch (NS)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.anchorPitchNS}
                  onChange={handleChange("anchorPitchNS")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorPitchNS)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle
                show={errors.anchorPitchNS}
                text={errors.anchorPitchNS}
              />
            </div>

            {/* Anchor Bolt Diameter + Number of Anchor Bolts side by side */}
            <div className="absolute top-[31%] xl:top-[43%] 2xl:top-[43%] -translate-y-1/2 -right-[122px] xl:-right-[341px] -translate-x-1/2 flex flex-col xl:flex-row gap-2">
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Anchor Bolt Diameter
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.anchorDia}
                    onChange={handleChange("anchorDia")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.anchorDia)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.anchorDia} text={errors.anchorDia} />
              </div>

              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Number of Anchor Bolts
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.anchorCount}
                    onChange={handleChange("anchorCount")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.anchorCount)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    pcs
                  </span>
                </div>
                <ErrorStyle
                  show={errors.anchorCount}
                  text={errors.anchorCount}
                />
              </div>
            </div>

            {/* Rib Angle (θ) — bottom right */}
            <div className="absolute top-[64%] xl:top-[65%] 2xl:top-[65%] -translate-y-1/2 -right-[80px] xl:-right-[98px] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Rib Angle (θ)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.ribAngle}
                  onChange={handleChange("ribAngle")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.ribAngle)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  deg
                </span>
              </div>
              <ErrorStyle show={errors.ribAngle} text={errors.ribAngle} />
            </div>

            {/* Number of Anchor Bolts on Tension Side — right aligned */}
            <div className="absolute top-[87%] xl:top-[89%] 2xl:top-[89%] -translate-y-1/2 -right-[152px] xl:-right-[270px] -translate-x-1/2">
              <label className="w-[170px] xl:w-full block text-xs md:text-sm text-gray-700 mb-1">
                Number of Anchor Bolts on Tension Side
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={eightRibType.anchorCountTension}
                  onChange={handleChange("anchorCountTension")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorCountTension)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  pcs
                </span>
              </div>
              <ErrorStyle
                show={errors.anchorCountTension}
                text={errors.anchorCountTension}
              />
            </div>
          </div>
        </div>

        {/* Main content grid: Side views */}
        <div className="flex justify-center items-center flex-col 2xl:flex-row 2xl:gap-32 2xl:pr-[100px]">
          {/* ================= SIDE VIEW : IMAGE + POSITIONED INPUTS ================= */}
          <div className="flex justify-center items-center pt-12">
            <div className="relative">
              <img
                src="/images/8Rib-SideView.svg"
                alt="8 rib baseplate side view"
                className="h-[215px] xl:h-[250px] 2xl:h-[250px] object-contain"
              />

              {/* Baseplate Thickness */}
              <div className="absolute -bottom-1 xl:bottom-[4%] -left-[66px] xl:-left-[76px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Baseplate Thickness
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.bpThickness}
                    onChange={handleChange("bpThickness")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.bpThickness)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.bpThickness}
                  text={errors.bpThickness}
                />
              </div>

              {/* Rib Plate Height */}
              <div className="absolute top-[39%] xl:top-[40%] left-12 2xl:left-12">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Height
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.ribHeight}
                    onChange={handleChange("ribHeight")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribHeight)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribHeight} text={errors.ribHeight} />
              </div>

              {/* Weld Leg Length */}
              <div className="absolute -top-4 xl:-top-1 -right-[37px] xl:-right-[49px] 2xl:-right-[49px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Weld Leg Length
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.weldLeg}
                    onChange={handleChange("weldLeg")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.weldLeg)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.weldLeg} text={errors.weldLeg} />
              </div>

              {/* Rib Plate Scallop */}
              <div className="absolute top-[26%] xl:top-[31%] -right-[37px] xl:-right-[49px] 2xl:-right-[49px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Scallop
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.ribScallop}
                    onChange={handleChange("ribScallop")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribScallop)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribScallop} text={errors.ribScallop} />
              </div>
            </div>
          </div>

          {/* ================= SECOND SIDE VIEW (For Rib Plate Length & Thickness) ================= */}
          <div className="flex justify-center items-center pt-24">
            <div className="relative">
              <img
                src="/images/4Rib-SideView (6).svg"
                alt="8 rib baseplate side view details"
                className="h-[250px] 2xl:h-[250px] object-contain"
              />

              {/* Rib Plate Length */}
              <div className="absolute -top-[50px] -right-[50px] -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Length
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.ribLength}
                    onChange={handleChange("ribLength")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribLength)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribLength} text={errors.ribLength} />
              </div>

              {/* Rib Plate Thickness */}
              <div className="absolute top-[14%] xl:top-[16%] -right-[180px] xl:-right-[215px] -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Thickness
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={eightRibType.ribThickness}
                    onChange={handleChange("ribThickness")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribThickness)} pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.ribThickness}
                  text={errors.ribThickness}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER SECTION: ACTIONS ================= */}
        <div className="flex justify-between items-center mt-6 pt-4 md:pt-6 border-t border-gray-200">
          {/* Reset button to clear all inputs */}
          <button
            onClick={handleReset}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
              rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm
              ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>

          {/* Button to trigger calculations */}
          <button
            onClick={onCalculate}
            className="flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 md:px-6
              rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-sm hp:text-xs hover:brightness-110 shadow-sm transition-all"
          >
            <Calculator className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Calculate Result
          </button>

          <div className="flex items-center gap-3">
            {/* Proceed to next step or report generation */}
            <button
              onClick={onNext}
              disabled={!isCalculated}
              className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 md:px-6
                rounded-lg hp:rounded-md font-medium transition-all text-sm hp:text-xs
                ${
                  !isCalculated
                    ? "bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }`}
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
