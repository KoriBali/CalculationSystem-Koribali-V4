import {
  RotateCcw,
  ChevronRight,
  Circle,
  DoorOpen,
  CheckCircle,
  Layers,
} from "lucide-react";
import { BaseplateIcon } from "../../../../../assets/icons/icon";
import { designStandardOptions } from "../../../constants/designStandards";
import { poleTypeOptions } from "../../../constants/poleTypeOptions";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border
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

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

// Reusable section card wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-lg md:rounded-xl border border-gray-200">
    {children}
  </div>
);

/**
 * Constants
 */
// Empty state used when resetting the form
const EMPTY_CONDITION = {
  designStandard: "",
  designWindSpeed: "",
  designAirDensity: "",
  poleType: "",
  openingEnabled: false,
  baseplateEnabled: false,
  foundationEnabled: false,
};

/**
 * MAIN COMPONENT: ConditionForm
 */
export function ConditionForm({
  projectType,
  condition,
  onUpdate,
  onFinish,
  errors,
}) {
  // Resets all fields back to empty
  const handleReset = () => onUpdate(EMPTY_CONDITION);

  return (
    <div className="bg-white rounded-b-xl md:rounded-b-2xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        {/* ── Standard and Condition ── */}
        <div>
          <SectionTitle>Standard and Condition</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 md:gap-y-8">
              {/* Design Standard */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Design Standard
                </label>
                <select
                  value={condition.designStandard}
                  onChange={(e) => onUpdate({ designStandard: e.target.value })}
                  className={`${inputStyle(errors.designStandard)} min-h-[42px]`}
                >
                  <option value="" disabled>
                    Select Design Standard
                  </option>
                  {(designStandardOptions[projectType] || []).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ErrorStyle
                  show={errors.designStandard}
                  text="Required field"
                />
              </div>

              {/* Design Wind Speed */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Design Wind Speed
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={condition.designWindSpeed}
                    onChange={(e) =>
                      onUpdate({ designWindSpeed: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.designWindSpeed)} md:pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-black-400">
                    m/s
                  </span>
                </div>
                <ErrorStyle
                  show={errors.designWindSpeed}
                  text={errors.designWindSpeed}
                />
              </div>

              {/* Air Density */}
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
                  Air Density
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={condition.designAirDensity}
                    onChange={(e) =>
                      onUpdate({ designAirDensity: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(errors.designAirDensity)} md:pr-24`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-black-400">
                    N・sec<sup>2</sup>/m<sup>4</sup>
                  </span>
                </div>
                <ErrorStyle
                  show={errors.designAirDensity}
                  text={errors.designAirDensity}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Select Pole Type (lighting-pole only) ── */}
        {projectType === "lighting-pole" && (
          <div>
            <SectionTitle>Select Pole Type</SectionTitle>
            <SectionCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poleTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = condition.poleType === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onUpdate({ poleType: option.id })}
                      className={`w-full text-left relative rounded-lg border p-4 transition-all duration-200
                        ${
                          isActive
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      {/* Active indicator */}
                      <div className="absolute top-4 right-4">
                        {isActive ? (
                          <CheckCircle size={21} className="text-blue-600" />
                        ) : (
                          <Circle size={21} className="text-slate-400" />
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-slate-800">
                            {option.title}
                          </p>
                          <p className="text-[12px] text-slate-500 mt-1">
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
            {errors.poleType && (
              <div className="mt-1 text-[11px] text-red-500">
                *Please select a pole type
              </div>
            )}
          </div>
        )}

        {/* ── Additional Component (toggles) ── */}
        <div>
          <SectionTitle>Additional Component</SectionTitle>
          <SectionCard>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Opening Part */}
              <ToggleCard
                label="Opening Part"
                icon={<DoorOpen size={16} />}
                enabled={condition.openingEnabled}
                onToggle={() =>
                  onUpdate({ openingEnabled: !condition.openingEnabled })
                }
              />

              {/* Baseplate */}
              <ToggleCard
                label="Baseplate"
                icon={<BaseplateIcon size={18} />}
                enabled={condition.baseplateEnabled}
                onToggle={() =>
                  onUpdate({ baseplateEnabled: !condition.baseplateEnabled })
                }
              />

              {/* Foundation */}
              <ToggleCard
                label="Foundation"
                icon={<Layers size={16} />}
                enabled={condition.foundationEnabled}
                onToggle={() =>
                  onUpdate({ foundationEnabled: !condition.foundationEnabled })
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          {/* Reset => clears all fields */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-[22px] md:px-7 py-[10px] md:py-2.5 bg-[#eef2f6] text-[#0d3b66] text-xs md:text-sm border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium"
          >
            <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
            Reset
          </button>

          {/* Finish => proceeds to next step */}
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-[22px] md:px-7 py-[10px] md:py-2.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg text-xs md:text-sm hover:brightness-110 transition-all shadow-sm font-medium"
          >
            Finish
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

// Reusable toggle card for additional components (Opening, Baseplate, Foundation)
function ToggleCard({ label, icon, enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer relative overflow-hidden rounded-lg border-2 p-5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]
        ${
          enabled
            ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
            : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`p-2 rounded-lg ${enabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
          >
            {icon}
          </div>
          {/* Label */}
          <p
            className={`text-sm font-medium ${enabled ? "text-slate-900" : "text-slate-500"}`}
          >
            {label}
          </p>
        </div>

        {/* Toggle switch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${enabled ? "bg-blue-500" : "bg-slate-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
}
