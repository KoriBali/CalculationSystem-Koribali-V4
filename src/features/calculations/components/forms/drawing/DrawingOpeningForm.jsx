import { RotateCcw, ChevronRight, Box } from "lucide-react";

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-3 md:-bottom-4 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export function DrawingOpeningForm({ opening, onUpdate, onReset, onNext, errors }) {
  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">

        {/* ── Opening Type Selection ── */}
        <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
          <div className="relative">
            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium">Opening Part Type</label>
            <div className="relative">
              <select
                value={opening.type || ""}
                onChange={(e) => onUpdate({ type: e.target.value })}
                className={`${inputStyle(errors.type)} lg:pl-3 xl:pl-4 pr-8 lg:pr-8 xl:pr-8 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] appearance-none`}
              >
                <option value="" disabled>Select Opening Type</option>
                <option value="box">Box Type</option>
                <option value="r">R Type</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
            <ErrorStyle show={errors.type} text={errors.type} />
          </div>
        </div>

        {/* ── Visual Editor (Side View Only) ── */}
        {opening.type ? (
          <div className="bg-white px-4 md:px-5 py-8 md:py-12 rounded-xl hp:rounded-lg border border-gray-200 flex justify-center">
            <div className="flex flex-row gap-1 sm:ml-[21px] 2xl:ml-0 justify-center items-center px-2 md:px-6">
              
              {/* Left Side: Opening Direction */}
              <div className="relative mb-[10px] sm:mb-[20px] w-[100px] sm:w-[120px] xl:w-[140px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium whitespace-nowrap">
                  Opening Direction
                </label>
                <div className="relative">
                  <select
                    value={opening.direction || ""}
                    onChange={(e) => onUpdate({ direction: e.target.value })}
                    className={`${inputStyle(errors.direction)} appearance-none pr-6 sm:pr-8`}
                  >
                    <option value="" disabled>Select</option>
                    <option value="left">Left</option>
                    <option value="front">Front</option>
                    <option value="right">Right</option>
                    <option value="back">Back</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                  </div>
                </div>
                <ErrorStyle show={errors.direction} text={errors.direction} />
              </div>

              {/* Middle: Side View Diagram */}
              <div className="flex items-center justify-center">
                <img
                  src={opening.type === "box" ? "/images/op-side-view-v2.svg" : "/images/RType-SideView (1).svg"}
                  alt="Side View"
                  className="h-[200px] sm:h-[320px] 2xl:h-[350px] object-contain"
                />
              </div>

              {/* Right Side: Opening Length (Height) */}
              <div className="relative mt-[80px] sm:mt-[150px] w-[100px] sm:w-[120px] xl:w-[140px]">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium whitespace-nowrap">
                  Opening Length
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={opening.height || ""}
                    onChange={(e) => onUpdate({ height: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.height)} pr-6 sm:pr-9 xl:pr-9 w-full`}
                  />
                  <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <ErrorStyle show={errors.height} text={errors.height} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Box className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Please select opening type first
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Choose the type above to configure parameters
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 mt-6" />

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          <button
            onClick={onReset}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
            rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm 
            ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>

          <button
            onClick={onNext}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
          >
            Next Step
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
