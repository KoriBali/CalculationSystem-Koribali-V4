import {
  RotateCcw,
  ChevronRight,
  CheckCircle,
  Circle,
  DoorOpen,
  Layers,
} from "lucide-react";
import { BaseplateIcon } from "../../../../../assets/icon";
import { useMasterData } from "../../../hooks/useMasterData";
import { poleTypeOptions } from "../../../constants/poleTypeOptions";
import { couplingUsageOptions } from "../../../constants/couplingUsageOptions";
import { FormSelect } from "../../../../../shared/components/FormSelect";

const DRAWING_TYPE_OPTIONS = [
  { value: "APD (Approval Drawing)", label: "APD (Approval Drawing)" },
  { value: "MFD (Manufacturer Drawing)", label: "MFD (Manufacturer Drawing)" },
  { value: "Order Drawing", label: "Order Drawing" },
  { value: "Meeting Drawing", label: "Meeting Drawing" },
];

const ToggleCard = ({ label, icon, enabled, onToggle, disabled = false }) => {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      className={`relative overflow-hidden rounded-lg border px-3 xl:px-4 py-2 lg:py-3 transition-all duration-300
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${disabled && !enabled ? "bg-slate-100 opacity-60" : ""}
        ${
          enabled
            ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
            : disabled
              ? "border-slate-200"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
        }
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
          className={`relative inline-flex h-5 w-10 md:h-6 md:w-11 items-center rounded-full ${enabled ? "bg-blue-500" : "bg-slate-300"} ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 md:h-4 md:w-4 transform rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
};

const CardOption = ({ label, desc, icon: Icon, current, value, onChange }) => {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${
          isActive
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-1.5 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
        >
          <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </div>
        <div className="flex flex-col items-start">
          <p
            className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-700"}`}
          >
            {label}
          </p>
          {desc && (
            <p
              className={`text-[11px] md:text-xs mt-0.5 ${isActive ? "text-slate-500" : "text-slate-400"}`}
            >
              {desc}
            </p>
          )}
        </div>
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
  ${
    hasError
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

export function DrawingGeneralForm({
  general,
  onUpdate,
  onReset,
  onNext,
  errors,
  projectMode,
  nextLabel = "Save & Continue",
}) {
  const {
    lightingCompanyOptions,
    loading: lightingCompaniesLoading,
    error: lightingCompaniesError,
    refetch: refetchLightingCompanies,
  } = useMasterData();
  const lightingCompaniesFailed =
    lightingCompaniesError &&
    lightingCompanyOptions.length === 0 &&
    !lightingCompaniesLoading;

  return (
    <div className="bg-white rounded-2xl hp:rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(15,23,42,0.06)] overflow-hidden">
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]" />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* ── Drawing Information ── */}
        <div>
          <SectionTitle>Drawing Information</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Drawing Type
                </label>
                <FormSelect
                  id="drawingType"
                  value={general.drawingType || ""}
                  onChange={(val) => onUpdate({ drawingType: val })}
                  options={DRAWING_TYPE_OPTIONS}
                  hasError={!!errors.drawingType}
                  placeholder="Select Drawing Type"
                />
                <ErrorStyle
                  show={errors.drawingType}
                  text={errors.drawingType}
                />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Drawing Number
                </label>
                <input
                  id="drawingNumber"
                  type="text"
                  value={general.drawingNumber || ""}
                  onChange={(e) => onUpdate({ drawingNumber: e.target.value })}
                  className={`${inputStyle(errors.drawingNumber)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle
                  show={errors.drawingNumber}
                  text={errors.drawingNumber}
                />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Part Number
                </label>
                <input
                  id="partNumber"
                  type="text"
                  value={general.partNumber || ""}
                  onChange={(e) => onUpdate({ partNumber: e.target.value })}
                  className={`${inputStyle(errors.partNumber)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                />
                <ErrorStyle show={errors.partNumber} text={errors.partNumber} />
              </div>

              <div className="relative pb-1">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Lighting Company Name
                </label>
                <FormSelect
                  id="lightingCompanyName"
                  value={general.lightingCompanyName || ""}
                  onChange={(val) =>
                    onUpdate({ lightingCompanyName: val })
                  }
                  options={lightingCompanyOptions}
                  loading={lightingCompaniesLoading}
                  disabled={lightingCompaniesFailed}
                  hasError={!!(errors.lightingCompanyName || lightingCompaniesFailed)}
                  placeholder={
                    lightingCompaniesFailed
                      ? "Failed to load"
                      : "Select Lighting Company"
                  }
                />
                {lightingCompaniesFailed ? (
                  <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
                    <span>Failed to load.</span>
                    <button
                      type="button"
                      onClick={refetchLightingCompanies}
                      className="underline hover:text-red-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <ErrorStyle
                    show={errors.lightingCompanyName}
                    text={errors.lightingCompanyName}
                  />
                )}
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

        {projectMode === "drawing" && (
          <>
            {/* ── Select Pole Type ── */}
            <div>
              <SectionTitle>Pole Type</SectionTitle>
              <SectionCard>
                <div id="poleType" className="relative pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {poleTypeOptions.map((option) => (
                      <CardOption
                        key={option.id}
                        label={option.title}
                        desc={option.desc}
                        icon={option.icon}
                        value={option.title}
                        current={general.poleType}
                        onChange={(val) => {
                          onUpdate({
                            poleType: val,
                            ...(option.id === "standard" && {
                              additionalComponents: {
                                ...(general.additionalComponents || {}),
                                opening: true,
                              },
                            }),
                          });
                        }}
                      />
                    ))}
                  </div>
                  <ErrorStyle show={errors.poleType} text={errors.poleType} />
                </div>
              </SectionCard>
            </div>

            {/* ── Additional Component ── */}
            <div>
              <SectionTitle>Additional Components</SectionTitle>
              <SectionCard>
                <div className="grid xl:grid-cols-3 gap-6">
                  <ToggleCard
                    label="Opening"
                    icon={<DoorOpen size={16} />}
                    enabled={general.additionalComponents?.opening || false}
                    disabled={general.poleType === "Standard Pole"}
                    onToggle={() =>
                      onUpdate({
                        additionalComponents: {
                          ...(general.additionalComponents || {}),
                          opening: !(
                            general.additionalComponents?.opening || false
                          ),
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
                          baseplate: !(
                            general.additionalComponents?.baseplate || false
                          ),
                        },
                      })
                    }
                  />
                  <ToggleCard
                    label="Foundation"
                    icon={<Layers size={16} />}
                    enabled={general.additionalComponents?.foundation || false}
                    onToggle={() =>
                      onUpdate({
                        additionalComponents: {
                          ...(general.additionalComponents || {}),
                          foundation: !(
                            general.additionalComponents?.foundation || false
                          ),
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
            <div id="useCoupling" className="relative pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {couplingUsageOptions.map((option) => (
                  <CardOption
                    key={option.id}
                    label={option.title}
                    desc={option.desc}
                    icon={option.icon}
                    value={option.id === "yes"}
                    current={general.useCoupling}
                    onChange={(val) => onUpdate({ useCoupling: val })}
                  />
                ))}
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
            className="flex items-center gap-2 px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-red-500 font-medium text-xs md:text-sm hover:bg-red-50 hover:text-red-600 transition-colors border border-red-300"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>

          <button
            onClick={onNext}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
          >
            {nextLabel}
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
