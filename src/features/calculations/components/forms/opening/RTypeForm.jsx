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

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: RTypeForm
 */
export function RTypeForm({
  rType,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  const handleReset = () => {
    onUpdate({
      opWidth: "",
      opSurfaceHeight: "",
      opLength: "",
    });
  };

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      {/* Wrapper TOP + BOTTOM jadi satu row di 2xl */}
      <div className="flex justify-center pb-6 pt-6 xl:pt-12">
        <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-center 2xl:gap-8">
          {/* ================= TOP SECTION ================= */}
          <div className="flex justify-end relative">
            <img
              src="/images/RType-TopView (8).svg"
              alt="Top View"
              className="w-[320px] sm:w-full sm:h-[260px]"
            />

            {/* Opening Width — tengah tengah */}
            <div className="absolute top-[49%] left-[42%] sm:left-[18%] 2xl:left-[14%] -translate-x-1/2 -translate-y-1/2">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Width
              </label>
              <div className="relative w-fit">
                <input
                  type="number"
                  min={0}
                  value={rType.opWidth}
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
            <div className="relative mb-[20px] w-[100px] sm:w-[140px]">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Surface Height
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={rType.opSurfaceHeight}
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
                src="/images/RType-SideView (1).svg"
                alt="Side View"
                className="h-[330px] 2xl:h-[350px] object-contain"
              />
            </div>

            {/* 3. Opening Length Input */}
            <div className="relative mt-[150px] w-[100px] sm:w-[140px]">
              <label className="block text-xs md:text-sm text-gray-700 mb-1">
                Opening Length
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={rType.opLength}
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
