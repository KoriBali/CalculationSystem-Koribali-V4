import { RotateCcw } from "lucide-react";
import {
  STEPPED_POLE_OPTIONS,
  COMBINATION_GROUPS,
  COMBINATIONS,
  GROUND_POSITION_OPTIONS,
} from "../../../../constants/straightPoleStandardOptions";
import { getThicknessOptions } from "../../../../logic/pole/standard/straightPoleLogic";

// === IMAGES ===
const onGlImg = "/images/on-gl.svg";
const upperGlImg = "/images/upper-gl.svg";
const underGlImg = "/images/under-gl.svg";

// Maps ground position id to its diagram image
const groundPositionImageMap = {
  onGL: onGlImg,
  upperGL: upperGlImg,
  underGL: underGlImg,
};

// === HELPERS ===
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `px-4 py-2.5 rounded-lg outline-none transition-all border text-sm pr-14 min-h-[42px]
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:py-2 hp:rounded-md hp:text-xs`;

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
      <span>*{text}</span>
    </div>
  ) : null;

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
    {children}
  </h3>
);

// Placeholder shown when a prerequisite field hasn't been selected yet
const SelectFirst = ({ message }) => (
  <div className="border border-slate-200 rounded-lg px-5 bg-slate-50 min-h-[42px] flex items-center">
    <p className="text-sm text-slate-400">{message}</p>
  </div>
);

// Empty reset state — used when reset button is clicked
const EMPTY_STEPPED_POLE = {
  combinationGroup: "",
  combination: "",
  upperThickness: "",
  upperLength: "",
  lowerThickness: "",
  lowerLength: "",
  embedmentLength: "",
  groundPosition: "",
  heightDepth: "",
};

// === COMPONENT ===
export function StraightPoleStandardForm({
  straightPoleStandard,
  onUpdate,
  errors,
  condition,
}) {
  // Derive thickness options from selected combination
  const { upper: upperOptions, lower: lowerOptions } = getThicknessOptions(
    straightPoleStandard.combination,
  );

  // Diagram image changes based on selected ground position
  const currentImage =
    groundPositionImageMap[straightPoleStandard.groundPosition] ?? onGlImg;

  // onGL mode disables the height depth input (fixed at ground level)
  const isOnGL = straightPoleStandard.groundPosition === "onGL";

  return (
    <div className="bg-white px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Select Pole Standard ── */}
      <div className="mb-6">
        <SectionTitle>Select Pole Standard</SectionTitle>
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STEPPED_POLE_OPTIONS.map((option) => {
              const isActive = straightPoleStandard.poleType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onUpdate({ poleType: option.id })}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main form — only shown after pole standard is selected ── */}
      {straightPoleStandard.poleType === "steppedPole" && (
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {/* ── Pole Data: combination + thickness + length ── */}
          <div>
            <SectionTitle>Pole Data</SectionTitle>
            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              {/* Diameter group + combination selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lower pole diameter group — resets combination on change */}
                <div>
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                    Select Lower Pole Diameter
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {COMBINATION_GROUPS.map((group) => {
                      const isActive =
                        straightPoleStandard.combinationGroup === group;

                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() =>
                            onUpdate({
                              combinationGroup: group,
                              combination: "",
                            })
                          }
                          className={`w-full py-2 rounded-lg min-h-[42px] text-sm border transition
                            ${
                              isActive
                                ? "bg-blue-50 border-blue-500 text-blue-600"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          {group}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Combination dropdown — resets thickness on change */}
                <div className="relative">
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                    Select Pole Combination
                  </h4>

                  {straightPoleStandard.combinationGroup ? (
                    <div className="relative">
                      <select
                        value={straightPoleStandard.combination}
                        onChange={(e) =>
                          onUpdate({
                            combination: e.target.value,
                            upperThickness: "", // reset downstream fields
                            lowerThickness: "",
                          })
                        }
                        className={`${inputStyle(errors.combination)} w-full min-h-[42px]`}
                      >
                        <option value="" disabled>
                          Select Combination
                        </option>
                        {COMBINATIONS[
                          straightPoleStandard.combinationGroup
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <SelectFirst message="Select lower pole diameter first" />
                  )}
                  <ErrorStyle show={errors.combination} text="Required field" />
                </div>
              </div>

              {/* Upper + lower thickness and length */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
                <div className="grid grid-cols-1 gap-6">
                  {/* Upper pole — thickness + length */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Upper thickness — depends on combination */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Upper Pole Thickness
                      </h4>
                      {straightPoleStandard.combination ? (
                        <div className="relative">
                          <select
                            value={straightPoleStandard.upperThickness}
                            onChange={(e) =>
                              onUpdate({ upperThickness: e.target.value })
                            }
                            className={`${inputStyle(errors.upperThickness)} min-h-[42px] w-full`}
                          >
                            <option value="" disabled>
                              Select Thickness
                            </option>
                            {upperOptions.map((t) => (
                              <option key={t} value={t}>
                                {t} mm
                              </option>
                            ))}
                          </select>
                          <ErrorStyle
                            show={errors.upperThickness}
                            text="Required field"
                          />
                        </div>
                      ) : (
                        <SelectFirst message="Select pole combination first" />
                      )}
                    </div>

                    {/* Upper length — free input */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Upper Pole Length
                      </h4>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          placeholder="Input Length"
                          value={straightPoleStandard.upperLength}
                          onChange={(e) =>
                            onUpdate({ upperLength: e.target.value })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputStyle(errors.upperLength)} w-full`}
                        />
                        <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-gray-400 hp:text-xs">
                          mm
                        </span>
                        <ErrorStyle
                          show={errors.upperLength}
                          text={errors.upperLength}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lower pole — thickness + length */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Lower thickness — depends on combination */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Lower Pole Thickness
                      </h4>
                      {straightPoleStandard.combination ? (
                        <div className="relative">
                          <select
                            value={straightPoleStandard.lowerThickness}
                            onChange={(e) =>
                              onUpdate({ lowerThickness: e.target.value })
                            }
                            className={`${inputStyle(errors.lowerThickness)} w-full min-h-[42px]`}
                          >
                            <option value="" disabled>
                              Select Thickness
                            </option>
                            {lowerOptions.map((t) => (
                              <option key={t} value={t}>
                                {t} mm
                              </option>
                            ))}
                          </select>
                          <ErrorStyle
                            show={errors.lowerThickness}
                            text="Required field"
                          />
                        </div>
                      ) : (
                        <SelectFirst message="Select pole combination first" />
                      )}
                    </div>

                    {/* Lower length — free input */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Lower Pole Length
                      </h4>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          placeholder="Input Length"
                          value={straightPoleStandard.lowerLength}
                          onChange={(e) =>
                            onUpdate({ lowerLength: e.target.value })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputStyle(errors.lowerLength)} w-full`}
                        />
                        <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-gray-400 hp:text-xs">
                          mm
                        </span>
                        <ErrorStyle
                          show={errors.lowerLength}
                          text={errors.lowerLength}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Installation type — determined by condition.baseplateEnabled ── */}
          <div>
            <SectionTitle>
              {condition.baseplateEnabled
                ? "Base Type Pole Installation"
                : "Embedment Type Pole Installation"}
            </SectionTitle>

            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
              {/* Embedment mode — shown when baseplate is disabled */}
              {!condition.baseplateEnabled && (
                <div className="grid grid-cols-1">
                  <div className="relative">
                    <label className="block text-sm text-gray-700 mb-3">
                      Embedment Length
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        placeholder="Input Length"
                        value={straightPoleStandard.embedmentLength}
                        onChange={(e) =>
                          onUpdate({ embedmentLength: e.target.value })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(errors.embedmentLength)} w-full`}
                      />
                      <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-gray-400 hp:text-xs">
                        mm
                      </span>
                    </div>
                    <ErrorStyle
                      show={errors.embedmentLength}
                      text={errors.embedmentLength}
                    />
                  </div>
                </div>
              )}

              {/* Baseplate mode — shown when baseplate is enabled */}
              {condition.baseplateEnabled && (
                <div className="grid grid-cols-1 gap-4">
                  <h4 className="block text-sm text-gray-700">
                    Select Ground Position
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {GROUND_POSITION_OPTIONS.map((opt) => {
                      const isActive =
                        straightPoleStandard.groundPosition === opt.id;
                      const isOnGL = opt.id === "onGL";
                      const disabled = isOnGL || !isActive;
                      const img = groundPositionImageMap[opt.id] ?? onGlImg;

                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            onUpdate({
                              groundPosition: opt.id,
                              heightDepth: opt.id === "onGL" ? "0" : "",
                            })
                          }
                          className={`flex flex-col gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
                          ${
                            isActive
                              ? "border-[#3399cc] bg-[#f0f8ff]"
                              : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {/* Label */}
                          <p
                            className={`text-xs md:text-sm font-semibold ${isActive ? "text-[#0d3b66]" : "text-gray-400"}`}
                          >
                            {opt.label}
                          </p>

                          {/* Diagram */}
                          <div className="h-44 md:h-52 flex items-center justify-center">
                            <img
                              src={img}
                              alt={opt.label}
                              className={`h-full object-contain transition-all ${!isActive ? "opacity-40" : ""}`}
                            />
                          </div>

                          {/* Depth input */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <label
                              className={`block text-xs md:text-sm mb-1 md:mb-2 ${isActive ? "text-gray-700" : "text-gray-300"}`}
                            >
                              Depth
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={
                                  isOnGL
                                    ? "0"
                                    : isActive
                                      ? straightPoleStandard.heightDepth
                                      : ""
                                }
                                disabled={disabled}
                                placeholder={
                                  isActive && !isOnGL ? "Input depth" : "—"
                                }
                                onChange={(e) =>
                                  !disabled &&
                                  onUpdate({ heightDepth: e.target.value })
                                }
                                onWheel={(e) => e.target.blur()}
                                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm outline-none transition-all border min-h-[42px] pr-10
                                ${
                                  disabled
                                    ? "bg-gray-100 border-gray-200 text-gray-400"
                                    : errors.heightDepth
                                      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
                                      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
                                }`}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                                mm
                              </span>
                            </div>
                            {isActive && errors.heightDepth && (
                              <p className="text-[10px] text-red-500 mt-1">
                                *{errors.heightDepth}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer: Reset ── */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => onUpdate(EMPTY_STEPPED_POLE)}
          className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
        >
          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
