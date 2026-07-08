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
  `px-2 sm:px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: FourRibTypeForm
 */
export function FourRibTypeForm({
  fourRibType,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  // Clear all dimension input fields
  const handleReset = () => {
    const emptyState = Object.keys(fourRibType).reduce((acc, key) => {
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
      <div className="sm:p-4 md:p-6">
        <div className="flex justify-center items-center pt-3 sm:pl-[93px] xl:pl-0 xl:pt-0 xl:pr-0 2xl:pr-[245px]">
          {/* ================= TOP VIEW : SVG + POSITIONED INPUTS ================= */}
          <div className="relative">
            <img
              src="/images/4Rib-TopView (22).svg"
              alt="4 rib baseplate top view"
              className="w-[290px] sm:w-full h-[380px] xl:h-[450px] 2xl:h-[450px] object-contain"
            />

            {/* Baseplate Width (EW) — top center */}
            <div className="absolute top-12 sm:top-0 xl:top-2 left-[52.6%] sm:left-[51.3%] xl:left-[49.6%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Baseplate Width (EW)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={fourRibType.bpWidthEW}
                  onChange={handleChange("bpWidthEW")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.bpWidthEW)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.bpWidthEW} text={errors.bpWidthEW} />
            </div>

            {/* Anchor Pitch (EW) — below Baseplate Width (EW) */}
            <div className="absolute top-[110px] sm:top-[23%] xl:top-[24%] left-[49.6%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Anchor Pitch (EW)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={fourRibType.anchorPitchEW}
                  onChange={handleChange("anchorPitchEW")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorPitchEW)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle
                show={errors.anchorPitchEW}
                text={errors.anchorPitchEW}
              />
            </div>

            {/* Baseplate Width (NS) — middle left edge */}
            <div className="hidden absolute top-[71%] -translate-y-1/2 -left-10 xl:-left-12">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Baseplate Width (NS)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={fourRibType.bpWidthNS}
                  onChange={handleChange("bpWidthNS")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.bpWidthNS)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.bpWidthNS} text={errors.bpWidthNS} />
            </div>

            {/* Anchor Pitch (NS) — to the right of Baseplate Width (NS) */}
            <div className="hidden absolute top-[71%] -translate-y-1/2 left-[20%] xl:left-[29%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Anchor Pitch (NS)
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={fourRibType.anchorPitchNS}
                  onChange={handleChange("anchorPitchNS")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorPitchNS)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle
                show={errors.anchorPitchNS}
                text={errors.anchorPitchNS}
              />
            </div>

            {/* Anchor Bolt Diameter + Number of Anchor Bolts side by side */}
            <div className="absolute top-[63%] sm:top-[73%] xl:top-[73.5%] 2xl:top-[73.5%] -translate-y-1/2 left-[35px] sm:left-[28px] xl:left-[18px] -translate-x-1/2 flex flex-col xl:flex-row gap-2 sm:gap-3 xl:gap-2">
              <div className="relative">
                <label className="w-[100px] sm:w-full block text-xs md:text-sm text-gray-700 mb-1">
                  Anchor Bolt Diameter
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.anchorDia}
                    onChange={handleChange("anchorDia")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.anchorDia)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.anchorDia} text={errors.anchorDia} />
              </div>

              <div className="hidden relative">
                <label className="w-[90px] sm:w-full block text-xs md:text-sm text-gray-700 mb-1">
                  Number of Anchor Bolts
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.anchorCount}
                    onChange={handleChange("anchorCount")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.anchorCount)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    pcs
                  </span>
                </div>
                <ErrorStyle
                  show={errors.anchorCount}
                  text={errors.anchorCount}
                />
              </div>
            </div>

            {/* Number of Anchor Bolts on Tension Side — left aligned */}
            <div className="hidden absolute top-[232px] sm:top-[72%] xl:top-[72%] 2xl:top-[72%] -translate-y-1/2 -right-[59px] sm:-right-[148px] xl:-right-[300px] -translate-x-1/2">
              <label className="w-[90px] sm:w-[170px] xl:w-full block text-xs md:text-sm text-gray-700 mb-1">
                Number of Anchor Bolts on Tension Side
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={fourRibType.anchorCountTension}
                  onChange={handleChange("anchorCountTension")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.anchorCountTension)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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

        {/* Main content grid: Inputs on the left, Diagrams on the right */}
        <div className="flex justify-center items-center flex-col 2xl:flex-row 2xl:gap-36 sm:pl-[12px] xl:pl-0 xl:pr-[96px] pr-[40px] sm:pr-0 2xl:pr-[75px]">
          {/* ================= SIDE VIEW : SVG/IMAGE + POSITIONED INPUTS ================= */}
          <div className="flex justify-center items-center pt-4 sm:pt-12">
            <div className="relative">
              <img
                src="/images/4Rib-SideView (3).svg"
                alt="4 rib baseplate side view"
                className="w-[300px] sm:w-full h-[180px] sm:h-[210px] xl:h-[250px] 2xl:h-[250px] object-contain"
              />

              {/* Baseplate Thickness */}
              <div className="absolute -bottom-6 sm:-bottom-1 xl:bottom-[4%] left-[3px] sm:-left-[66px] xl:-left-[76px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Baseplate Thickness
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.bpThickness}
                    onChange={handleChange("bpThickness")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.bpThickness)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.bpThickness}
                  text={errors.bpThickness}
                />
              </div>

              {/* Rib Plate Height */}
              <div className="absolute top-[41.5%] sm:top-[39%] xl:top-[40%] left-[3px] sm:left-12 2xl:left-12">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Height
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribHeight}
                    onChange={handleChange("ribHeight")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribHeight)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribHeight} text={errors.ribHeight} />
              </div>

              {/* Weld Leg Length */}
              <div className="absolute top-2 sm:-top-3 xl:-top-1 -right-[38px] sm:-right-[52px] xl:-right-[65px] 2xl:-right-[65px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Weld Leg Length
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.weldLeg}
                    onChange={handleChange("weldLeg")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.weldLeg)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.weldLeg} text={errors.weldLeg} />
              </div>

              {/* Rib Plate Scallop */}
              <div className="absolute top-[74px] sm:top-[30%] xl:top-[34%] -right-[38px] sm:-right-[52px] xl:-right-[65px] 2xl:-right-[65px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Scallop
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribScallop}
                    onChange={handleChange("ribScallop")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribScallop)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribScallop} text={errors.ribScallop} />
              </div>

              {/* Rib Plate Length */}
              <div className="hidden absolute -top-3 -right-24 -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Length
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribLength}
                    onChange={handleChange("ribLength")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribLength)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribLength} text={errors.ribLength} />
              </div>

              {/* Rib Plate Thickness */}
              <div className="hidden absolute top-[28%] -right-42 -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Thickness
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribThickness}
                    onChange={handleChange("ribThickness")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribThickness)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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

          {/* ================= SECOND SIDE VIEW (For Rib Plate Length & Thickness) ================= */}
          <div className="flex justify-center items-center pt-24 pr-[18px] sm:pr-0 sm:pl-[290px] xl:pl-[345px] 2xl:pl-0 2xl:pt-2">
            <div className="relative">
              <img
                src="/images/4Rib-SideView (6).svg"
                alt="4 rib baseplate side view details"
                className="h-[160px] sm:h-[220px] xl:h-[250px] object-contain"
              />

              {/* Rib Plate Length (Class 'hidden' dihapus) */}
              <div className="absolute -top-[45px] sm:-top-[50px] -right-[35px] sm:-right-[46px] xl:-right-[52px] -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Length
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribLength}
                    onChange={handleChange("ribLength")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribLength)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.ribLength} text={errors.ribLength} />
              </div>

              {/* Rib Plate Thickness (Class 'hidden' dihapus) */}
              {/* Catatan: -right-42 bukan ukuran bawaan Tailwind, pertimbangkan ganti ke -right-40 atau -right-[168px] */}
              <div className="absolute top-[10%] sm:top-[23%] xl:top-[16%] -right-[150px] sm:-right-[155px] xl:-right-[215px] -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Rib Plate Thickness
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ribThickness}
                    onChange={handleChange("ribThickness")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ribThickness)} pr-6 sm:pr-9 xl:pr-9 w-[90px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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
        <div className="flex justify-between items-center mt-6 px-4 sm:px-0 pb-4 sm:pb-0 pt-4 md:pt-6 border-t border-gray-200 hp:gap-2">
          {/* Reset button to clear all inputs */}
          <button
            onClick={handleReset}
            title="Reset"
            className="flex justify-center items-center gap-2 px-5 py-2.5 hp:px-3 hp:py-2 md:px-6
              rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm 
              ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            <span className="hp:hidden">Reset</span>
          </button>

          {/* Button to trigger calculations */}
          <button
            onClick={onCalculate}
            className="flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-4 hp:py-2 md:px-6 
                rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-sm hover:brightness-110 shadow-sm transition-all"
          >
            <Calculator className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            <span className="hp:text-[11px] whitespace-nowrap">
              Calculate Result
            </span>
          </button>

          <div className="flex items-center gap-3 hp:gap-0">
            {/* Proceed to next step or report generation */}
            <button
              onClick={onNext}
              disabled={!isCalculated}
              title={buttonLabel}
              className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-3 hp:py-2 md:px-6 
                rounded-lg hp:rounded-md font-medium transition-all text-sm
                ${
                  !isCalculated
                    ? "bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }`}
            >
              <span className="hp:hidden">{buttonLabel}</span>
              <ChevronRight className="w-4 md:w-5 h-4 md:h-5 hp:w-4 hp:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
