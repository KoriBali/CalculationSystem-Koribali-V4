import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

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
 * MAIN COMPONENT: RoundCaissonTypeForm
 */
export function RoundCaissonTypeForm({
  roundCaisson,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
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

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        {/* Main content grid: Inputs on the left, Diagrams on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* ================= LEFT SECTION: DATA INPUT ================= */}
          <div className="px-4 md:px-5 py-5 rounded-lg md:rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* Foundation Width Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  Foundation Width
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.foundationWidthX}
                    onChange={(e) =>
                      onUpdate({ foundationWidthX: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.foundationWidthX)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.foundationWidthX}
                  text={errors.foundationWidthX}
                />
              </div>

              {/* Foundation Width Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  Foundation Width
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.foundationWidthY}
                    onChange={(e) =>
                      onUpdate({ foundationWidthY: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.foundationWidthY)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.foundationWidthY}
                  text={errors.foundationWidthY}
                />
              </div>

              {/* Embedment Depth Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  Embedment Depth
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.embedmentDepth}
                    onChange={(e) =>
                      onUpdate({ embedmentDepth: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.embedmentDepth)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorStyle
                  show={errors.embedmentDepth}
                  text={errors.embedmentDepth}
                />
              </div>

              {/* N Value Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  N Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.nValue}
                    onChange={(e) => onUpdate({ nValue: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.nValue)}`}
                  />
                </div>
                <ErrorStyle show={errors.nValue} text={errors.nValue} />
              </div>

              {/* γ Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  γ
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.yValue}
                    onChange={(e) => onUpdate({ yValue: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.yValue)} pr-16`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                    kN/m<sup>3</sup>
                  </span>
                </div>
                <ErrorStyle show={errors.yValue} text={errors.yValue} />
              </div>

              {/* γc Input */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  γc
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.ycValue}
                    onChange={(e) => onUpdate({ ycValue: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.ycValue)} pr-16`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                    kN/m<sup>3</sup>
                  </span>
                </div>
                <ErrorStyle show={errors.ycValue} text={errors.ycValue} />
              </div>

              {/* α Input */}
              <div className="col-span-2  relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-3">
                  α
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={roundCaisson.alphaValue}
                    onChange={(e) => onUpdate({ alphaValue: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.alphaValue)} `}
                  />
                </div>
                <ErrorStyle show={errors.alphaValue} text={errors.alphaValue} />
              </div>
            </div>
          </div>

          {/* ================= RIGHT SECTION: TECHNICAL DIAGRAMS ================= */}
          <div className="flex flex-col justify-center gap-6">
            {/* Diagram: Top View */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex items-center justify-center min-h-[241.98px] hover:shadow-sm transition">
              <img
                src="/images/caisson-round-topview.png"
                alt="Top View"
                className="max-h-44 object-contain"
              />
            </div>

            {/* Diagram: Side View */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex items-center justify-center min-h-[241.98px] hover:shadow-sm transition">
              <img
                src="/images/caisson-round-sideview.png"
                alt="Side View"
                className="max-h-44 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="mt-6 border-t border-gray-200"></div>

        {/* ================= FOOTER SECTION: ACTIONS ================= */}
        <div className="flex justify-between items-center pt-4 md:pt-6">
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
