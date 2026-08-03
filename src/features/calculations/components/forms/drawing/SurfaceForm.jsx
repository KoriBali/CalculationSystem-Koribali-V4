import { RotateCcw, ChevronRight, CheckCircle, Circle, Sparkles, PaintBucket } from "lucide-react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 */
const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
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

const CardOption = ({ label, icon: Icon, current, value, onChange }) => {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${isActive
          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`p-2 rounded-lg hp:rounded-md transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600"}`}
          >
            <Icon size={16} />
          </div>
        )}
        <p
          className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-700"}`}
        >
          {label}
        </p>
      </div>
      <div className="shrink-0 ml-2">
        {isActive ? (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        ) : (
          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
        )}
      </div>
    </button>
  );
};

export function SurfaceForm({ surface, onUpdate, onReset, onFinish, errors }) {
  const handleSurfaceTreatmentChange = (val) => {
    const updates = { surfaceTreatmentType: val };
    if (val === "Plating Only") {
      updates.paintingType = "";
      updates.colorName = "";
      updates.munsellValue = "";
      updates.colorCode = "";
    }
    onUpdate(updates);
  };

  const handlePlatingTypeChange = (val) => {
    const updates = { platingType: val };
    if (val === "Standard Plating") {
      updates.specificPlatingTypeCode = "HZTD";
    } else {
      updates.specificPlatingTypeCode = "";
    }
    onUpdate(updates);
  };

  const handlePaintingTypeChange = (val) => {
    const updates = { paintingType: val };
    if (val !== "Specified Color Paint") {
      updates.colorName = "";
      updates.munsellValue = "";
      updates.colorCode = "";
    }
    onUpdate(updates);
  };

  const isPaintingEnabled = surface.surfaceTreatmentType === "Plating + Painting";

  // Generate color combined string
  const colorParts = [];
  if (surface.colorName) colorParts.push(surface.colorName);
  if (surface.munsellValue) colorParts.push(surface.munsellValue);
  if (surface.colorCode) colorParts.push(surface.colorCode);
  const colorCombined = colorParts.join(" ");

  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">

        {/* ── Surface Treatment ── */}
        <div>
          <SectionTitle>Surface Treatment of Pole</SectionTitle>
          <SectionCard>
            <div className="space-y-6 md:space-y-8">

              {/* 1. Selection */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-3">
                  Pole Surface Treatment Option
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CardOption
                    label="Plating Only"
                    value="Plating Only"
                    icon={Sparkles}
                    current={surface.surfaceTreatmentType}
                    onChange={handleSurfaceTreatmentChange}
                  />
                  <CardOption
                    label="Plating + Painting"
                    value="Plating + Painting"
                    icon={PaintBucket}
                    current={surface.surfaceTreatmentType}
                    onChange={handleSurfaceTreatmentChange}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* 2. Plating Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="relative">
                  <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                    Plating Type
                  </label>
                  <div className="relative">
                    <select
                      value={surface.platingType || ""}
                      onChange={(e) => handlePlatingTypeChange(e.target.value)}
                      className={`${inputStyle(errors.platingType)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] cursor-pointer appearance-none`}
                    >
                      <option value="" disabled>Select Plating Type</option>
                      <option value="Standard Plating">Standard Plating</option>
                      <option value="Not Standard Plating">Not Standard Plating</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                    </div>
                  </div>
                  <ErrorStyle show={errors.platingType} text={errors.platingType} />
                </div>

                <div className="relative pb-1">
                  <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                    Specific Plating Type Code
                  </label>
                  <input
                    type="text"
                    placeholder="ex: HDZT63, HZTD, etc"
                    value={surface.specificPlatingTypeCode || ""}
                    onChange={(e) => onUpdate({ specificPlatingTypeCode: e.target.value })}
                    readOnly={surface.platingType === "Standard Plating"}
                    className={`${inputStyle(errors.specificPlatingTypeCode)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] ${surface.platingType === "Standard Plating" ? "bg-slate-50 text-slate-800 cursor-default focus:border-gray-300 focus:ring-0" : ""
                      }`}
                  />
                  <ErrorStyle show={errors.specificPlatingTypeCode} text={errors.specificPlatingTypeCode} />
                </div>
              </div>

              {/* 3. Painting Details (Conditionally Rendered) */}
              {isPaintingEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="border-t border-gray-100 mb-6" />

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                          Painting Type
                        </label>
                        <div className="relative">
                          <select
                            value={surface.paintingType || ""}
                            onChange={(e) => handlePaintingTypeChange(e.target.value)}
                            className={`${inputStyle(errors.paintingType)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] cursor-pointer appearance-none`}
                          >
                            <option value="" disabled>Select Painting Type</option>
                            <option value="Acrilic Silicone">Acrilic Silicone</option>
                            <option value="Stain Coating">Stain Coating</option>
                            <option value="Ceramic Coating">Ceramic Coating</option>
                            <option value="Specified Color Paint">Specified Color Paint</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                          </div>
                        </div>
                        <ErrorStyle show={errors.paintingType} text={errors.paintingType} />
                      </div>
                    </div>

                    {surface.paintingType === "Specified Color Paint" && (
                      <div className="p-4 md:p-5 rounded-xl border border-gray-200 space-y-4">
                        <label className="block text-xs md:text-sm font-semibold text-gray-800">
                          Specified Color Details
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                          <div className="relative pb-1">
                            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Color Name</label>
                            <input
                              type="text"
                              value={surface.colorName || ""}
                              onChange={(e) => onUpdate({ colorName: e.target.value })}
                              className={`${inputStyle(errors.colorName)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                            />
                            <ErrorStyle show={errors.colorName} text={errors.colorName} />
                          </div>
                          <div className="relative pb-1">
                            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Munsell value</label>
                            <input
                              type="text"
                              value={surface.munsellValue || ""}
                              onChange={(e) => onUpdate({ munsellValue: e.target.value })}
                              className={`${inputStyle(errors.munsellValue)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                            />
                            <ErrorStyle show={errors.munsellValue} text={errors.munsellValue} />
                          </div>
                          <div className="relative pb-1">
                            <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">Color code</label>
                            <input
                              type="text"
                              value={surface.colorCode || ""}
                              onChange={(e) => onUpdate({ colorCode: e.target.value })}
                              className={`${inputStyle(errors.colorCode)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                            />
                            <ErrorStyle show={errors.colorCode} text={errors.colorCode} />
                          </div>
                        </div>

                        <div className="relative pt-1">
                          <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                            Color Name + Munsell value + Color code
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={colorCombined}
                            placeholder="ex: ブラウン 日塗工No.15-20B 近似 (YPTR-363A)"
                            className={`${inputStyle()} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] bg-gray-100 cursor-default text-gray-700 font-medium focus:border-gray-300 focus:ring-0`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
