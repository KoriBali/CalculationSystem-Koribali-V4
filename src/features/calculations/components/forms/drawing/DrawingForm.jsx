import { RotateCcw, ChevronRight, PenTool } from "lucide-react";

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

const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
    {children}
  </div>
);

/**
 * MAIN COMPONENT: DrawingForm
 */
export function DrawingForm({ drawing, onUpdate, onReset, onFinish, errors }) {
  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        <div>
          <SectionTitle>Drawing Specifications</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 md:gap-y-8">
              {/* Drawing Type */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Drawing Type
                </label>
                <input
                  type="text"
                  value={drawing.drawingType}
                  onChange={(e) => onUpdate({ drawingType: e.target.value })}
                  className={`${inputStyle(errors.drawingType)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.drawingType} text={errors.drawingType} />
              </div>

              {/* Surface Treatment */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Surface Treatment
                </label>
                <input
                  type="text"
                  value={drawing.surfaceTreatment}
                  onChange={(e) => onUpdate({ surfaceTreatment: e.target.value })}
                  className={`${inputStyle(errors.surfaceTreatment)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.surfaceTreatment} text={errors.surfaceTreatment} />
              </div>

              {/* Coating Type */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Coating Type
                </label>
                <input
                  type="text"
                  value={drawing.coatingType}
                  onChange={(e) => onUpdate({ coatingType: e.target.value })}
                  className={`${inputStyle(errors.coatingType)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.coatingType} text={errors.coatingType} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

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
            onClick={onFinish}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
          >
            Finish
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
