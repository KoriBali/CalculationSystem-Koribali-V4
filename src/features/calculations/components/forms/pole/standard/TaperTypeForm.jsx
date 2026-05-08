import { RotateCcw } from "lucide-react";
import {
  POLE_STANDARD_OPTIONS,
  HEIGHT_OPTIONS_BY_STANDARD,
  GROUND_POSITION_OPTIONS,
} from "../../../../constants/taperPoleStandradOptions";

// === IMAGES ===
const onGlImg = "/images/on-gl.svg";
const underGlImg = "/images/under-gl.svg";

// === HELPERS ===
// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
    {children}
  </h3>
);

// Maps ground position to its diagram image
const groundPositionImageMap = {
  onGL: onGlImg,
  underGL: underGlImg,
};

// Empty state — shown when no height options are available
const EMPTY_HEIGHT_OPTIONS = { onGL: [], underGL: [] };

// Empty reset state — used when reset button is clicked
const EMPTY_POLE_STANDARD = {
  poleType: "",
  groundPosition: "",
  height: "",
};

// === COMPONENT ===
export function poleTypeForm({ taperPoleStandard, onUpdate }) {
  // Get height options based on selected pole standard
  const currentHeightOptions =
    HEIGHT_OPTIONS_BY_STANDARD[taperPoleStandard.poleType] ??
    EMPTY_HEIGHT_OPTIONS;

  // Diagram image changes based on selected ground position
  const currentImage =
    groundPositionImageMap[taperPoleStandard.groundPosition] ?? onGlImg;

  // Ground position and height are disabled until pole standard is selected
  const isGroundDisabled = !taperPoleStandard.poleType;

  return (
    <div className="bg-white px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Select Pole Standard ── */}
      <div className="mb-6">
        <SectionTitle>Select Pole Standard</SectionTitle>
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {POLE_STANDARD_OPTIONS.map((option) => {
              const isActive = taperPoleStandard.poleType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      poleType: option.id,
                      groundPosition: "", // reset downstream fields
                      height: "",
                    })
                  }
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

      {/* ── Ground Position + Height ── */}
      <div className="mb-6">
        <SectionTitle>Ground Configuration</SectionTitle>
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="grid md:grid-cols-1">
            {/* Ground position selector — disabled until pole standard is picked */}
            <div>
              <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                Select Ground Position{" "}
                {isGroundDisabled && (
                  <span className="text-gray-400 font-normal">
                    (select pole standard first)
                  </span>
                )}
              </h4>

              <div className="flex gap-3 mb-4">
                {GROUND_POSITION_OPTIONS.map((option) => {
                  const isActive =
                    taperPoleStandard.groundPosition === option.id;

                  return (
                    <button
                      key={option.id}
                      disabled={isGroundDisabled}
                      onClick={() => {
                        if (isGroundDisabled) return;
                        onUpdate({ groundPosition: option.id, height: "" }); // reset height on position change
                      }}
                      className={`w-48 rounded-lg border px-4 py-2.5 transition-all flex items-center gap-3
                        ${
                          isGroundDisabled
                            ? "bg-gray-100 text-gray-400 border-gray-200"
                            : isActive
                              ? "border-blue-500 bg-blue-50 cursor-pointer"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                        }`}
                    >
                      {/* Custom radio indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${
                          isGroundDisabled
                            ? "border-gray-300"
                            : isActive
                              ? "border-blue-500"
                              : "border-gray-400"
                        }`}
                      >
                        {isActive && !isGroundDisabled && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Height selector + ground position diagram */}
            <div className="flex justify-center gap-5 items-center bg-gray-50 border rounded-lg p-4 h-72 2040:h-80 overflow-hidden">
              <div className="flex flex-col justify-end pb-6 h-full">
                <div className="flex flex-col">
                  <span className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                    Height of Structure
                  </span>

                  {/* Show dropdown only after ground position is selected */}
                  {taperPoleStandard.groundPosition ? (
                    <select
                      value={taperPoleStandard.height}
                      onChange={(e) => onUpdate({ height: e.target.value })}
                      className="w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm min-h-[42px] focus:border-blue-500 outline-none transition-all bg-white hp:p-2 hp:rounded-md hp:text-xs"
                    >
                      <option value="" disabled>
                        Select Height
                      </option>
                      {currentHeightOptions[
                        taperPoleStandard.groundPosition
                      ]?.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // Placeholder when ground position not yet selected
                    <div className="border border-slate-200 rounded-lg bg-slate-50 min-h-[42px] w-[200px] flex items-center justify-center px-2">
                      <p className="text-sm text-slate-400 text-center">
                        Select ground position first
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagram — updates based on selected ground position */}
              <img
                key={currentImage}
                src={currentImage}
                alt="Ground position diagram"
                className="h-full object-contain transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer: Reset ── */}
      <div className="flex justify-between pt-6 border-t mt-8">
        <button
          type="button"
          onClick={() => onUpdate(EMPTY_POLE_STANDARD)}
          className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
        >
          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
