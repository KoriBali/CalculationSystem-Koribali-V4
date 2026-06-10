import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

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

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: BoxTypeForm
 */
export function BoxTypeForm({
  boxType,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  const handleReset = () => {
    onUpdate({
      boxWidth: "",
      opWidth: "",
      boxHeight: "",
      opSurfaceHeight: "",
      opLength: "",
    });
  };

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      {/* Wrapper TOP + BOTTOM jadi satu row di lg */}
      <div className="flex justify-center pb-6 pt-6 xl:pt-12">
        <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-center 2xl:gap-8">
          {/* ================= TOP SECTION ================= */}
          <div className="flex justify-end relative">
            <img
              src="/images/box-op-top-view-v2 (11).svg"
              alt="Top View"
              className="w-[320px] sm:w-full sm:h-[320px] 2xl:h-[350px]"
            />

            {/* Box Height — tengah atas */}
            <div className="absolute -top-1 sm:top-5 2xl:top-6 left-[53%] sm:left-[60%] 2xl:left-[58%] -translate-x-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Box Thickness
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={boxType.boxHeight}
                  onChange={(e) => onUpdate({ boxHeight: e.target.value })}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.boxHeight)} pr-9 xl:pr-9 w-[100px] sm:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.boxHeight} text={errors.boxHeight} />
            </div>

            {/* Box Width — tengah kiri */}
            <div className="absolute top-[61%] -translate-y-1/2 left-1 sm:-left-3 2xl:-left-14">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Box Width
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={boxType.boxWidth}
                  onChange={(e) => onUpdate({ boxWidth: e.target.value })}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.boxWidth)} pr-9 xl:pr-9 w-[100px] sm:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.boxWidth} text={errors.boxWidth} />
            </div>

            {/* Opening Width — tengah tengah */}
            <div className="absolute top-[61%] left-[42%] 2xl:left-[30%] -translate-x-1/2 -translate-y-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Width
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={boxType.opWidth}
                  onChange={(e) => onUpdate({ opWidth: e.target.value })}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.opWidth)} pr-9 xl:pr-9 w-[100px] sm:w-[140px]`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.opWidth} text={errors.opWidth} />
            </div>
          </div>

          {/* ================= BOTTOM SECTION ================= */}
          <div className="flex flex-row gap-1 items-center px-4 md:px-6">
            {/* 1. Opening Surface Height Input */}
            <div className="relative w-[160px] md:w-[180px]">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Surface Height
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={boxType.opSurfaceHeight}
                  onChange={(e) =>
                    onUpdate({ opSurfaceHeight: e.target.value })
                  }
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.opSurfaceHeight)} pr-9 xl:pr-9`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle
                show={errors.opSurfaceHeight}
                text={errors.opSurfaceHeight}
              />
            </div>

            {/* 2. Diagram: Side View */}
            <div className="flex items-center justify-center">
              <img
                src="/images/op-side-view-v2.svg"
                alt="Side View"
                className="h-[320px] 2xl:h-[350px] object-contain"
              />
            </div>

            {/* 3. Opening Length Input */}
            <div className="relative mt-[150px] w-[160px] md:w-[180px]">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Length
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={boxType.opLength}
                  onChange={(e) => onUpdate({ opLength: e.target.value })}
                  onWheel={(e) => e.target.blur()}
                  className={`${inputStyle(errors.opLength)} pr-9 xl:pr-9`}
                />
                <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.opLength} text={errors.opLength} />
            </div>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t mx-4 md:mx-6 border-gray-200"></div>

      {/* ================= FOOTER SECTION: ACTIONS ================= */}
      <div className="flex justify-between items-center pt-6 px-4 md:px-6 pb-6 xl:pb-6">
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
  );
}
