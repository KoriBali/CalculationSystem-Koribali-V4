import { RotateCcw, ChevronRight } from "lucide-react";

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-3 md:-bottom-4 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
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

export function DrawingGeneralForm({ general, onUpdate, onReset, onNext, errors }) {
  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">

        {/* ── Project Information ── */}
        <div>
          <SectionTitle>Project Information</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Drawing Type</label>
                <input
                  type="text"
                  value={general.drawingType || ""}
                  onChange={(e) => onUpdate({ drawingType: e.target.value })}
                  className={`${inputStyle(errors.drawingType)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.drawingType} text={errors.drawingType} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Drawing Number</label>
                <input
                  type="text"
                  value={general.drawingNumber || ""}
                  onChange={(e) => onUpdate({ drawingNumber: e.target.value })}
                  className={`${inputStyle(errors.drawingNumber)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.drawingNumber} text={errors.drawingNumber} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Part Number</label>
                <input
                  type="text"
                  value={general.partNumber || ""}
                  onChange={(e) => onUpdate({ partNumber: e.target.value })}
                  className={`${inputStyle(errors.partNumber)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.partNumber} text={errors.partNumber} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Lighting Company Name</label>
                <div className="relative">
                  <select
                    value={general.lightingCompanyName || ""}
                    onChange={(e) => onUpdate({ lightingCompanyName: e.target.value })}
                    className={`${inputStyle(errors.lightingCompanyName)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>Select Lighting Company</option>
                    <option value="Koito (LEV-1761A22)">Koito (LEV-1761A22)</option>
                    <option value="Iwasaki (E77257SAJ9)">Iwasaki (E77257SAJ9)</option>
                    <option value="Panasonic (NYR30031LF9)">Panasonic (NYR30031LF9)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
                <ErrorStyle show={errors.lightingCompanyName} text={errors.lightingCompanyName} />
              </div>

              {/* HIDDEN TEMPORARILY: Opening Direction
              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Opening Direction</label>
                <input
                  type="text"
                  value={general.openingDirection || ""}
                  onChange={(e) => onUpdate({ openingDirection: e.target.value })}
                  className={`${inputStyle(errors.openingDirection)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.openingDirection} text={errors.openingDirection} />
              </div>
              */}
            </div>
          </SectionCard>
        </div>

        {/* ── Approval Information ── */}
        <div>
          <SectionTitle>Approval Information</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Designer Name</label>
                <input
                  type="text"
                  value={general.designerName || ""}
                  onChange={(e) => onUpdate({ designerName: e.target.value })}
                  className={`${inputStyle(errors.designerName)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.designerName} text={errors.designerName} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Checked By Name</label>
                <input
                  type="text"
                  value={general.checkedByName || ""}
                  onChange={(e) => onUpdate({ checkedByName: e.target.value })}
                  className={`${inputStyle(errors.checkedByName)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.checkedByName} text={errors.checkedByName} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Approved By Name</label>
                <input
                  type="text"
                  value={general.approvedByName || ""}
                  onChange={(e) => onUpdate({ approvedByName: e.target.value })}
                  className={`${inputStyle(errors.approvedByName)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.approvedByName} text={errors.approvedByName} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Coupling Configuration ── */}
        <div>
          <SectionTitle>Coupling Usage</SectionTitle>
          <SectionCard>
            <div className="relative pb-2">
              <label className="block text-xs md:text-sm font-medium text-gray-800 mb-3">
                Do you want to use coupling?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="useCoupling"
                    checked={general.useCoupling === true}
                    onChange={() => onUpdate({ useCoupling: true })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-xs md:text-sm text-gray-700 group-hover:text-gray-900 font-medium">Yes, use coupling</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="useCoupling"
                    checked={general.useCoupling === false}
                    onChange={() => onUpdate({ useCoupling: false })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-xs md:text-sm text-gray-700 group-hover:text-gray-900 font-medium">No, skip coupling</span>
                </label>
              </div>
              <ErrorStyle show={errors.useCoupling} text={errors.useCoupling} />
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
