import { RotateCcw, ChevronRight, CheckCircle, Circle, FileText, Settings2, Link, XCircle, DoorOpen, Layers } from "lucide-react";
import { BaseplateIcon } from "../../../../../assets/icon";

const ToggleCard = ({ label, icon, enabled, onToggle, disabled = false }) => {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      className={`relative overflow-hidden rounded-lg border px-3 xl:px-4 py-2 lg:py-3 transition-all duration-300
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${
          enabled
            ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
            : "border-slate-200 bg-slate-50/50"
        }
        ${!disabled && !enabled ? "hover:border-slate-300 hover:bg-slate-50" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-md ${enabled ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
          >
            {icon}
          </div>
          <p
            className={`text-[12px] md:text-sm font-medium ${enabled ? "text-slate-900" : "text-slate-500"}`}
          >
            {label}
          </p>
        </div>
        <button
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onToggle();
          }}
          className={`relative inline-flex h-5 w-10 md:h-6 md:w-11 items-center rounded-full ${enabled ? "bg-blue-500" : "bg-slate-300"} ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 md:h-4 md:w-4 transform rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
};

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
        <div className={`p-1.5 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
          <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </div>
        <p className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-700"}`}>
          {label}
        </p>
      </div>
      <div className="shrink-0 ml-2 flex items-center">
        {isActive ? (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        ) : (
          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
        )}
      </div>
    </button>
  );
};

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

export function DrawingGeneralForm({ general, onUpdate, onReset, onNext, errors, projectMode }) {
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

        {projectMode === "drawing" && (
          <>
            {/* ── Select Pole Type ── */}
            <div>
              <SectionTitle>Select Pole Type</SectionTitle>
              <SectionCard>
                <div className="relative pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardOption
                      label="Lighting Pole Standard"
                      icon={FileText}
                      value="Lighting Pole Standard"
                      current={general.poleType}
                      onChange={(val) => {
                        onUpdate({ 
                          poleType: val,
                          additionalComponents: {
                            ...(general.additionalComponents || {}),
                            opening: true,
                            foundation: false
                          }
                        });
                      }}
                    />
                    <CardOption
                      label="Custom Pole"
                      icon={Settings2}
                      value="Custom Pole"
                      current={general.poleType}
                      onChange={(val) => onUpdate({ poleType: val })}
                    />
                  </div>
                  <ErrorStyle show={errors.poleType} text={errors.poleType} />
                </div>
              </SectionCard>
            </div>

            {/* ── Additional Component ── */}
            <div>
              <SectionTitle>Additional Component</SectionTitle>
              <SectionCard>
                <div className="grid xl:grid-cols-3 gap-6">
                  <ToggleCard
                    label="Opening"
                    icon={<DoorOpen size={16} />}
                    enabled={general.additionalComponents?.opening || false}
                    disabled={general.poleType === "Lighting Pole Standard"}
                    onToggle={() =>
                      onUpdate({
                        additionalComponents: {
                          ...(general.additionalComponents || {}),
                          opening: !(general.additionalComponents?.opening || false),
                        },
                      })
                    }
                  />
                  <ToggleCard
                    label="Baseplate"
                    icon={<BaseplateIcon size={18} />}
                    enabled={general.additionalComponents?.baseplate || false}
                    onToggle={() =>
                      onUpdate({
                        additionalComponents: {
                          ...(general.additionalComponents || {}),
                          baseplate: !(general.additionalComponents?.baseplate || false),
                        },
                      })
                    }
                  />
                  <ToggleCard
                    label="Foundation"
                    icon={<Layers size={16} />}
                    enabled={general.additionalComponents?.foundation || false}
                    disabled={general.poleType === "Lighting Pole Standard"}
                    onToggle={() =>
                      onUpdate({
                        additionalComponents: {
                          ...(general.additionalComponents || {}),
                          foundation: !(general.additionalComponents?.foundation || false),
                        },
                      })
                    }
                  />
                </div>
              </SectionCard>
            </div>
          </>
        )}

        {/* ── Coupling Configuration ── */}
        <div>
          <SectionTitle>Coupling Usage</SectionTitle>
          <SectionCard>
            <div className="relative pb-2">
              <label className="block text-xs md:text-sm font-medium text-gray-800 mb-3">
                Do you want to use coupling?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardOption
                  label="Yes, use coupling"
                  icon={Link}
                  value={true}
                  current={general.useCoupling}
                  onChange={(val) => onUpdate({ useCoupling: val })}
                />
                <CardOption
                  label="No, skip coupling"
                  icon={XCircle}
                  value={false}
                  current={general.useCoupling}
                  onChange={(val) => onUpdate({ useCoupling: val })}
                />
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
            Save & Continue
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
