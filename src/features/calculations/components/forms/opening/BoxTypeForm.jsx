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
  isCalculationAndDrawing = false,
}) {
  const handleReset = () => {
    onUpdate({
      boxWidth: "",
      opWidth: "",
      boxHeight: "",
      opSurfaceHeight: "",
      opLength: "",
      openingDirection: "",
    });
  };

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      {/* Wrapper TOP + BOTTOM jadi satu row di lg */}
      <div className="flex justify-center pb-8 pt-12 sm:pt-8 xl:pt-12">
        <div className="flex flex-col gap-12 2xl:flex-row 2xl:items-center 2xl:gap-8">
          {/* ================= TOP SECTION ================= */}
          <div className="flex justify-start sm:justify-end ml-[19px] sm:ml-0 sm:mr-[40px] xl:mr-0 relative">
            {/* Di bawah sm pakai gambar (12), sm ke atas pakai (11) */}
            <img
              src="/images/box-op-top-view-v2 (12).svg"
              alt="Top View"
              className="block sm:hidden h-[450px]"
            />
            <img
              src="/images/box-op-top-view-v2 (11).svg"
              alt="Top View"
              className="hidden sm:block w-full sm:h-[290px] xl:h-[320px] 2xl:h-[350px]"
            />

            {/* Box Height — tengah atas */}
            <div className="absolute top-[224px] sm:top-4 xl:top-5 2xl:top-6 left-[246px] sm:left-[57%] xl:left-[56%] xl:left-[55%] 2xl:left-[58%] -translate-x-1/2">
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
                  className={`${inputStyle(errors.boxHeight)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.boxHeight} text={errors.boxHeight} />
            </div>

            {/* Box Width — tengah kiri */}
            <div className="absolute -top-1 sm:top-[62%] xl:top-[61%] -translate-y-1/2 left-[48px] sm:left-[5px] xl:left-[64px] 2xl:-left-14">
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
                  className={`${inputStyle(errors.boxWidth)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.boxWidth} text={errors.boxWidth} />
            </div>

            {/* Opening Width — tengah tengah */}
            <div className="absolute top-[27.6%] sm:top-[62%] xl:top-[61%] left-[95px] sm:left-[34%] xl:left-[37%] 2xl:left-[30%] -translate-x-1/2 -translate-y-1/2">
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
                  className={`${inputStyle(errors.opWidth)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                  mm
                </span>
              </div>
              <ErrorStyle show={errors.opWidth} text={errors.opWidth} />
            </div>
          </div>

          {/* ================= BOTTOM SECTION ================= */}
          <div className="flex flex-row gap-1 justify-end items-center sm:ml-[240px] xl:ml-[309px] 2xl:ml-0 px-0 xl:px-6">
            {/* 1. Opening Surface Height Input */}
            <div className="relative w-[100px] sm:w-[120px] xl:w-[140px]">
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
                  className={`${inputStyle(errors.opSurfaceHeight)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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
                className="h-[250px] sm:h-[320px] 2xl:h-[350px] object-contain"
              />
            </div>

            {/* 3. Opening Length Input */}
            <div className="relative mt-[150px] w-[100px] sm:w-[120px] xl:w-[140px]">
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
                  className={`${inputStyle(errors.opLength)} pr-6 sm:pr-9 xl:pr-9 w-[100px] sm:w-[120px] xl:w-[140px]`}
                />
                <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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

      {/* ── Opening Direction (only in Calculation & Drawing mode) ── */}
      {isCalculationAndDrawing && (
        <div className="px-4 md:px-6 pt-5 pb-2">
          <div className="relative max-w-xs">
            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium">
              Opening Direction
            </label>
            <div className="relative">
              <select
                value={boxType.openingDirection || ""}
                onChange={(e) => onUpdate({ openingDirection: e.target.value })}
                className={`${inputStyle(errors.openingDirection)} w-full appearance-none pr-8 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
              >
                <option value="" disabled>Select Direction</option>
                <option value="left">Left</option>
                <option value="front">Front</option>
                <option value="right">Right</option>
                <option value="back">Back</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
            <ErrorStyle show={errors.openingDirection} text={errors.openingDirection} />
          </div>
        </div>
      )}

      {/* ================= FOOTER SECTION: ACTIONS ================= */}
      <div className="flex justify-between items-center pt-6 px-4 md:px-6 pb-6 xl:pb-6 hp:gap-2">
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
  );
}
