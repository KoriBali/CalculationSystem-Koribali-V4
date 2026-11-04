import { RotateCcw, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { GROUND_POSITION_OPTIONS } from "../../../../constants/straightPoleStandardOptions";
import { getThicknessOptions } from "../../../../logic/pole/standard/straightPoleLogic";
import { usePoleStandardData } from "../../../../hooks/usePoleStandardData";
import { ConfirmResetAllModal } from "../../../modals/ConfirmResetAllModal";
import { FormSelect } from "../../../../../../shared/components/FormSelect";
import { AdaptiveGroundPositionInput } from "../common/AdaptiveGroundPositionInput";
import STANDARD_POLE_DATA from "../../../../data/specStandardPole.json";

// === IMAGES ===
const onGlImg = "/images/on-gl.svg";
const onGldImg = "/images/on-GL(h).svg";
const upperGlImg = "/images/upper-gl.svg";
const upperGldImg = "/images/upper-GL(h).svg";
const underGlImg = "/images/under-gl.svg";
const underGldImg = "/images/under-GL(h).svg";

// Maps ground position id to its diagram image
const groundPositionImageMap = {
  onGL: onGlImg,
  upperGL: upperGlImg,
  underGL: underGlImg,
};

const groundPositionImageMapD = {
  onGL: onGldImg,
  upperGL: upperGldImg,
  underGL: underGldImg,
};

// === HELPERS ===
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg outline-none transition-all border text-sm pr-9
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:rounded-md hp:text-xs`;

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
  <div className="border border-slate-200 rounded-lg hp:rounded-md px-5 py-2 lg:py-2.5 bg-slate-50 flex items-center">
    <p className="text-sm hp:text-xs text-slate-400">{message}</p>
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
  lowestHeight: "",
};

// === COMPONENT ===
export function StraightPoleStandardForm({
  straightPoleStandard,
  onUpdate,
  errors,
  condition,
  readOnly = false,
}) {
  const {
    steppedPoleOptions,
    combinationGroups,
    combinations,
    tplMap,
    loading: poleStandardLoading,
    error: poleStandardError,
    refetch: refetchPoleStandard,
  } = usePoleStandardData();

  const [showResetModal, setShowResetModal] = useState(false);

  // Derive thickness options from selected combination
  const { upper: upperOptions, lower: lowerOptions } = getThicknessOptions(
    straightPoleStandard.combination,
    tplMap,
  );

  // Derive human-readable spec for the currently selected combination
  const selectedCombinationSpec = useMemo(() => {
    if (!straightPoleStandard.combination) return null;
    const pole =
      STANDARD_POLE_DATA?.straight?.[straightPoleStandard.combination];
    if (!pole || !Array.isArray(pole.poles) || pole.poles.length < 2)
      return null;
    return {
      upperD: pole.poles[0]?.lowerDiameter || pole.poles[0]?.upperDiameter,
      lowerD: pole.poles[1]?.lowerDiameter || pole.poles[1]?.upperDiameter,
      material: pole.poles[0]?.material || "STK400",
    };
  }, [straightPoleStandard.combination]);

  // Enrich combination options with upper pole diameter for clear readability
  const combinationOptions = useMemo(() => {
    const list = combinations[straightPoleStandard.combinationGroup] || [];
    return list.map((c) => {
      const pole = STANDARD_POLE_DATA?.straight?.[c];
      const upperD =
        pole?.poles?.[0]?.lowerDiameter || pole?.poles?.[0]?.upperDiameter;
      return {
        value: c,
        label: upperD ? `${c} (Upper ø${upperD} mm)` : c,
      };
    });
  }, [combinations, straightPoleStandard.combinationGroup]);

  // Diagram image changes based on selected ground position
  const currentImage =
    groundPositionImageMap[straightPoleStandard.groundPosition] ?? onGlImg;

  // onGL mode disables the height depth input (fixed at ground level)
  const isOnGL = straightPoleStandard.groundPosition === "onGL";

  return (
    <div className="bg-white px-4 md:px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Select Pole Standard ── */}
      <div className="mb-6">
        <SectionTitle>
          Select Pole Standard Type{" "}
          <span className="text-red-500 ml-1 font-semibold">*</span>
        </SectionTitle>
        <div className="border border-slate-200 rounded-xl hp:rounded-lg p-4 sm:p-6 bg-white shadow-sm">
          {poleStandardLoading && steppedPoleOptions.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-11 rounded-lg hp:rounded-md bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse border border-slate-200/80 flex items-center justify-between px-4"
                >
                  <div className="w-24 h-3.5 bg-slate-200/80 rounded" />
                  <div className="w-4 h-4 rounded-full bg-slate-200/80" />
                </div>
              ))}
            </div>
          ) : !poleStandardLoading &&
            poleStandardError &&
            steppedPoleOptions.length === 0 ? (
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs sm:text-sm text-red-600">
                Failed to load pole standard options.
              </p>
              <button
                type="button"
                onClick={refetchPoleStandard}
                className="text-xs sm:text-sm font-medium text-red-600 underline hover:text-red-700 shrink-0"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {steppedPoleOptions.map((option) => {
                const isActive = straightPoleStandard.poleType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onUpdate({ poleType: option.id })}
                    className={`rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium transition-all
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
          )}
        </div>
      </div>

      {/* ── Main form — only shown after pole standard is selected ── */}
      {straightPoleStandard.poleType === "steppedPole" && (
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {/* ── Pole Data: combination + thickness + length ── */}
          <div>
            <SectionTitle>Pole Data</SectionTitle>
            <div className="border border-slate-200 rounded-xl hp:rounded-lg p-4 md:p-6 bg-white shadow-sm space-y-6">
              {/* Diameter group + combination selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lower pole diameter group — resets combination on change */}
                <div>
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                    Select Lower Pole Diameter (mm){" "}
                    <span className="text-red-500 ml-1 font-semibold">*</span>
                  </h4>
                  {poleStandardLoading && combinationGroups.length === 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-full h-10 rounded-lg hp:rounded-md bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse border border-slate-200/80 flex items-center justify-center"
                        >
                          <div className="w-12 h-3.5 bg-slate-200/80 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {combinationGroups.map((group) => {
                        const isActive =
                          straightPoleStandard.combinationGroup === group;

                        return (
                          <button
                            key={group}
                            type="button"
                            disabled={readOnly}
                            onClick={() => {
                              if (readOnly) return;
                              onUpdate({
                                combinationGroup: group,
                                combination: "",
                              });
                            }}
                            className={`w-full py-2 lg:py-2.5 rounded-lg hp:rounded-md text-sm hp:text-xs border transition
                              ${readOnly ? "cursor-default" : "cursor-pointer"}
                              ${
                                isActive
                                  ? "bg-blue-50 border-blue-500 text-blue-600"
                                  : readOnly
                                    ? "border-slate-100 text-slate-400 bg-slate-50/50"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                          >
                            {group}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Combination dropdown — resets thickness on change */}
                <div className="relative">
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                    Select Pole Combination{" "}
                    <span className="text-red-500 ml-1 font-semibold">*</span>
                  </h4>

                  {poleStandardLoading &&
                  !straightPoleStandard.combinationGroup ? (
                    <div className="border border-slate-200 rounded-lg hp:rounded-md px-4 py-2 lg:py-2.5 bg-slate-50 flex items-center justify-between animate-pulse">
                      <div className="w-32 h-3.5 bg-slate-200/80 rounded" />
                      <div className="w-4 h-4 rounded bg-slate-200/80" />
                    </div>
                  ) : straightPoleStandard.combinationGroup ? (
                    <>
                      <FormSelect
                        value={straightPoleStandard.combination}
                        disabled={readOnly}
                        onChange={(val) =>
                          onUpdate({
                            combination: val,
                            upperThickness: "", // reset downstream fields
                            lowerThickness: "",
                          })
                        }
                        options={combinationOptions}
                        loading={poleStandardLoading}
                        hasError={!!errors.combination}
                        placeholder="Select Combination"
                      />

                      {/* Combination Dimension Specs Info Box */}
                      {selectedCombinationSpec && (
                        <div className="hidden mt-2.5 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 font-medium">
                              Upper Pole:
                            </span>
                            <span className="font-semibold text-[#0d3b66]">
                              ø{selectedCombinationSpec.upperD} mm
                            </span>
                          </div>
                          <span className="hidden sm:inline text-slate-300">
                            •
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 font-medium">
                              Lower Pole:
                            </span>
                            <span className="font-semibold text-[#0d3b66]">
                              ø{selectedCombinationSpec.lowerD} mm
                            </span>
                          </div>
                          <span className="hidden sm:inline text-slate-300">
                            •
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 font-medium">
                              Material:
                            </span>
                            <span className="font-semibold text-[#0d3b66]">
                              {selectedCombinationSpec.material}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <SelectFirst message="Select lower pole diameter first" />
                  )}
                  <ErrorStyle show={errors.combination} text="Required field" />
                </div>
              </div>

              {/* Upper + lower thickness and length */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 hp:p-4 hp:rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {/* Upper pole — thickness + length */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Upper thickness — depends on combination */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                        Upper Pole Thickness{" "}
                        <span className="text-red-500 ml-1 font-semibold">
                          *
                        </span>
                      </h4>
                      {poleStandardLoading &&
                      straightPoleStandard.combination ? (
                        <div className="border border-slate-200 rounded-lg hp:rounded-md px-4 py-2 lg:py-2.5 bg-slate-50 flex items-center justify-between animate-pulse">
                          <div className="w-24 h-3.5 bg-slate-200/80 rounded" />
                          <div className="w-4 h-4 rounded bg-slate-200/80" />
                        </div>
                      ) : straightPoleStandard.combination ? (
                        <div className="relative">
                          <FormSelect
                            value={straightPoleStandard.upperThickness}
                            onChange={(val) =>
                              onUpdate({ upperThickness: val })
                            }
                            options={upperOptions.map((t) => ({
                              value: t,
                              label: `${t} mm`,
                            }))}
                            loading={poleStandardLoading}
                            hasError={!!errors.upperThickness}
                            placeholder="Select Thickness"
                          />
                          <ErrorStyle
                            show={errors.upperThickness}
                            text={errors.upperThickness}
                          />
                        </div>
                      ) : (
                        <SelectFirst message="Select pole combination first" />
                      )}
                    </div>

                    {/* Upper length — free input */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                        Upper Pole Length{" "}
                        <span className="text-red-500 ml-1 font-semibold">
                          *
                        </span>
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
                          className={`${inputStyle(errors.upperLength)} w-full xl:pr-10`}
                        />
                        <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Lower thickness — depends on combination */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                        Lower Pole Thickness{" "}
                        <span className="text-red-500 ml-1 font-semibold">
                          *
                        </span>
                      </h4>
                      {poleStandardLoading &&
                      straightPoleStandard.combination ? (
                        <div className="border border-slate-200 rounded-lg hp:rounded-md px-4 py-2 lg:py-2.5 bg-slate-50 flex items-center justify-between animate-pulse">
                          <div className="w-24 h-3.5 bg-slate-200/80 rounded" />
                          <div className="w-4 h-4 rounded bg-slate-200/80" />
                        </div>
                      ) : straightPoleStandard.combination ? (
                        <div className="relative">
                          <FormSelect
                            value={straightPoleStandard.lowerThickness}
                            onChange={(val) =>
                              onUpdate({ lowerThickness: val })
                            }
                            options={lowerOptions.map((t) => ({
                              value: t,
                              label: `${t} mm`,
                            }))}
                            loading={poleStandardLoading}
                            hasError={!!errors.lowerThickness}
                            placeholder="Select Thickness"
                          />
                          <ErrorStyle
                            show={errors.lowerThickness}
                            text={errors.lowerThickness}
                          />
                        </div>
                      ) : (
                        <SelectFirst message="Select pole combination first" />
                      )}
                    </div>

                    {/* Lower length — free input */}
                    <div>
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-2">
                        Lower Pole Length{" "}
                        <span className="text-red-500 ml-1 font-semibold">
                          *
                        </span>
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
                          className={`${inputStyle(errors.lowerLength)} w-full xl:pr-10`}
                        />
                        <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
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
                ? "Pole Base Type"
                : "Pole Embedment Type"}
            </SectionTitle>

            <div className="border border-slate-200 rounded-xl hp:rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              {/* Embedment mode — shown when baseplate is disabled */}
              {!condition.baseplateEnabled && (
                <div className="grid grid-cols-1">
                  {/* <div className="relative">
                    <label className="block text-sm hp:text-xs text-gray-700 mb-4 hp:mb-2">
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
                  </div> */}
                  <div className="flex flex-col gap-2 rounded-xl hp:rounded-lg border-2 p-4 cursor-pointer transition-all border-[#3399cc] bg-[#f0f8ff]">
                    {/* Label */}
                    <p className="text-xs md:text-sm font-semibold text-[#0d3b66]">
                      Embedment
                    </p>

                    <div className="flex hp:flex-col flex-row items-center justify-center h-52 hp:h-auto">
                      {/* Image for Mobile */}
                      <img
                        src="/images/embedment(l).svg"
                        alt="embedment"
                        className="hidden hp:block mb-4 h-40 w-full object-contain"
                      />
                      {/* Embedment input */}
                      <div className="hp:w-full w-auto">
                        <label className="block text-xs md:text-sm mb-2 text-gray-700">
                          <span className="hidden hp:inline">
                            Embedment Length (l){" "}
                            <span className="text-red-500 ml-1 font-semibold">
                              *
                            </span>
                          </span>
                          <span className="hp:hidden inline">
                            Embedment Length{" "}
                            <span className="text-red-500 ml-1 font-semibold">
                              *
                            </span>
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Input Length"
                            value={straightPoleStandard.embedmentLength}
                            onChange={(e) =>
                              onUpdate({ embedmentLength: e.target.value })
                            }
                            onWheel={(e) => e.target.blur()}
                            className={`w-full pl-3 md:pl-4 pr-9 py-2 lg:py-2.5 rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all border
                                    ${
                                      errors.embedmentLength
                                        ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
                                        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
                                    }`}
                          />
                          <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                            mm
                          </span>
                        </div>
                        {errors.embedmentLength && (
                          <p className="text-[10px] text-red-500 mt-1">
                            *{errors.embedmentLength}
                          </p>
                        )}
                      </div>
                      {/* Image */}
                      <img
                        src="/images/embedment.svg"
                        alt="embedment"
                        className="block hp:hidden h-full w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Baseplate mode — shown when baseplate is enabled */}
              {condition.baseplateEnabled && (
                <div className="w-full">
                  <AdaptiveGroundPositionInput
                    value={straightPoleStandard.lowestHeight ?? ""}
                    groundPosition={
                      straightPoleStandard.groundPosition ?? "onGL"
                    }
                    onChange={({ lowestHeight, groundPosition }) => {
                      onUpdate({ lowestHeight, groundPosition });
                    }}
                    error={errors.lowestHeight}
                    disabled={readOnly}
                    label="Lowest Height"
                    required={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer: Reset ── */}
      {!readOnly && (
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex justify-center items-center text-sm gap-2 px-5 py-2.5 sm:py-2.5 lg:py-2.5 md:px-6 bg-white text-red-500 border border-red-300 rounded-lg hp:rounded-md
            hover:bg-red-50 hover:text-red-600 transition-colors font-medium hp:text-xs"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>
        </div>
      )}

      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={() => onUpdate(EMPTY_STEPPED_POLE)}
        title="Reset all inputs on this section?"
        description="This will clear all inputs entered in this section. This action cannot be undone."
      />
    </div>
  );
}
