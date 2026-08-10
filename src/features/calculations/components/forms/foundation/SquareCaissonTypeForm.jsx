import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

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
 * MAIN COMPONENT: SquareCaissonTypeForm
 */
export function SquareCaissonTypeForm({
  squareCaisson,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
  isDrawingMode = false,
}) {
  // Clear all dimension input fields
  const handleReset = () => {
    onUpdate({
      foundationWidthX: "",
      foundationWidthY: "",
      embedmentDepth: "",
      nValue: "",
      yValue: "",
      ycValue: "",
      alphaValue: "",
    });
  };

  const handleChange = (field) => (e) => {
    onUpdate({ [field]: e.target.value });
  };

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      {/* ================= DIMENSION INPUT ================= */}
      <div className="px-6 md:px-8 pt-6 md:pt-8">
        <h3 className="text-[#0d3b66] flex items-center gap-2 text-xs md:text-sm font-medium">
          <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
          Dimension Input
        </h3>
      </div>

      <div className="flex justify-center pb-6 pt-6 xl:pt-10">
        <div className="flex flex-col gap-0 sm:gap-12 xl:gap-6 xl:flex-row xl:items-center 2xl:gap-20">
          {/* ================= TOP SECTION: TOP VIEW SVG + POSITIONED INPUTS ================= */}
          <div className="flex justify-center items-center pl-[50px] sm:pl-0 sm:pr-[93px] xl:pr-0 pt-0 xl:pt-0">
            <div className="relative">
              <img
                src="/images/SquareCaisson-TopView (10).svg"
                alt="Square Caisson Top View"
                className="w-[240px] h-[220px] sm:w-full sm:h-[300px] xl:h-[310px] 2xl:h-[350px] object-contain"
              />

              {/* Foundation Width X — top center */}
              <div className="absolute -top-1 sm:-top-5 xl:-top-4 left-[158px] sm:left-[255px] xl:left-[258px] 2xl:left-[288.6px] -translate-x-1/2">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 whitespace-nowrap">
                  Foundation Width (X)
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={squareCaisson.foundationWidthX}
                    onChange={handleChange("foundationWidthX")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.foundationWidthX)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.foundationWidthX}
                  text={errors.foundationWidthX}
                />
              </div>

              {/* Foundation Width Y — middle left */}
              <div className="absolute top-[145px] sm:top-[64.4%] 2xl:top-[64.5%] -translate-y-1/2 -left-[56px] sm:-left-[48px] xl:-left-[53px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1">
                  Foundation Width (Y)
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={squareCaisson.foundationWidthY}
                    onChange={handleChange("foundationWidthY")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.foundationWidthY)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.foundationWidthY}
                  text={errors.foundationWidthY}
                />
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION: SIDE VIEW SVG + POSITIONED INPUT ================= */}
          <div className="flex justify-center pl-[57px] sm:pl-[93px] xl:pl-0 items-center">
            <div className="relative">
              <img
                src="/images/SquareCaisson-SideView (3).svg"
                alt="Square Caisson Side View"
                className="block sm:hidden w-[220px] h-[200px] object-contain"
              />
              <img
                src="/images/SquareCaisson-SideView (4).svg"
                alt="Square Caisson Side View"
                className="hidden sm:block w-full h-[300px] xl:h-[310px] 2xl:h-[350px] object-contain"
              />

              {/* Embedment Depth — right side */}
              <div className="absolute top-[135px] sm:top-[64%] 2xl:top-[64.1%] -translate-y-1/2 right-[185px] sm:-right-[52px] xl:-right-[65px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 whitespace-nowrap">
                  Embedment Depth
                </label>
                <div className="relative w-fit">
                  <input
                    type="number"
                    min={0}
                    value={squareCaisson.embedmentDepth}
                    onChange={handleChange("embedmentDepth")}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.embedmentDepth)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.embedmentDepth}
                  text={errors.embedmentDepth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SOIL PARAMETERS ================= */}
      <div className="px-6 md:px-8 pt-6 pb-8">
        <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-xs md:text-sm font-medium">
          <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
          Soil Parameters
        </h3>
        <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xl:gap-4 2xl:gap-6">
            {/* N Value */}
            <div className="relative">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                N Value
              </label>
              <input
                type="number"
                min={0}
                value={squareCaisson.nValue}
                onChange={handleChange("nValue")}
                onWheel={(e) => e.target.blur()}
                className={`${inputStyle(errors.nValue)} w-full`}
              />
              <ErrorStyle show={errors.nValue} text={errors.nValue} />
            </div>

            {/* γ */}
            <div className="relative">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                γ
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={squareCaisson.yValue}
                  onChange={handleChange("yValue")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.yValue)} w-full !pr-10 sm:!pr-14`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  kN/m<sup>3</sup>
                </span>
              </div>
              <ErrorStyle show={errors.yValue} text={errors.yValue} />
            </div>

            {/* γc */}
            <div className="relative">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                γc
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={squareCaisson.ycValue}
                  onChange={handleChange("ycValue")}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.ycValue)} w-full !pr-10 sm:!pr-14`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  kN/m<sup>3</sup>
                </span>
              </div>
              <ErrorStyle show={errors.ycValue} text={errors.ycValue} />
            </div>

            {/* α */}
            <div className="relative">
              <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                α
              </label>
              <input
                type="number"
                min={0}
                value={squareCaisson.alphaValue}
                onChange={handleChange("alphaValue")}
                onWheel={(e) => e.target.blur()}
                className={`${inputStyle(errors.alphaValue)} w-full`}
              />
              <ErrorStyle show={errors.alphaValue} text={errors.alphaValue} />
            </div>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t mx-4 md:mx-6 border-gray-200"></div>

      {/* ================= FOOTER SECTION: ACTIONS ================= */}
      <div className="flex justify-between items-center pt-6 px-4 md:px-6 pb-6 xl:pb-6 hp:gap-2">
        {/* Reset button */}
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

        {/* Calculate button */}
        {!isDrawingMode && (
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
        )}

        <div className="flex items-center gap-3 hp:gap-0">
          {/* Next step button */}
          <button
            onClick={onNext}
            disabled={!isDrawingMode && !isCalculated}
            title={buttonLabel}
            className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-3 hp:py-2 md:px-6 
              rounded-lg hp:rounded-md font-medium transition-all text-sm
              ${
                (!isDrawingMode && !isCalculated)
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
  );
}
