import { RotateCcw, Box } from "lucide-react";
import {
  POLE_STANDARD_OPTIONS,
  HEIGHT_OPTIONS_BY_STANDARD,
  GROUND_POSITION_OPTIONS,
} from "../../../../constants/taperPoleStandradOptions";

// === IMAGES (12 cases: 6 pole types × 2 ground positions) ===
const DIAGRAM_IMAGE_MAP = {
  IS: {
    onGL: "/images/IS-Type-OnGL.svg",
    underGL: "/images/IS-Type-UnderGL.svg",
  },
  IA: {
    onGL: "/images/IA-Type-OnGL.svg",
    underGL: "/images/IA-Type-UnderGL.svg",
  },
  LS: {
    onGL: "/images/LS-Type-OnGL.svg",
    underGL: "/images/LS-Type-UnderGL.svg",
  },
  LA: {
    onGL: "/images/LA-Type-OnGL.svg",
    underGL: "/images/LA-Type-UnderGL.svg",
  },
  TS: {
    onGL: "/images/TS-Type-OnGL.svg",
    underGL: "/images/TS-Type-UnderGL.svg",
  },
  TA: {
    onGL: "/images/TA-Type-OnGL.svg",
    underGL: "/images/TA-Type-UnderGL.svg",
  },
};

// === HELPERS ===
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
    {children}
  </h3>
);

const EMPTY_HEIGHT_OPTIONS = { onGL: [], underGL: [] };

const EMPTY_POLE_STANDARD = {
  poleType: "",
  groundPosition: "",
  height: "",
};

// === COMPONENT ===
export function TaperPoleStandardForm({ taperPoleStandard, onUpdate }) {
  const currentHeightOptions =
    HEIGHT_OPTIONS_BY_STANDARD[taperPoleStandard.poleType] ??
    EMPTY_HEIGHT_OPTIONS;

  const currentImage =
    taperPoleStandard.poleType && taperPoleStandard.groundPosition
      ? (DIAGRAM_IMAGE_MAP[taperPoleStandard.poleType]?.[
          taperPoleStandard.groundPosition
        ] ?? null)
      : null;

  const isGroundDisabled = !taperPoleStandard.poleType;
  const showDiagram = !!currentImage;

  return (
    <div className="bg-white px-4 md:px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Section title ── */}
      <div className="mb-4">
        <SectionTitle>Pole Standard Configuration</SectionTitle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 hp:gap-3">
        {/* ── LEFT: Pole Type ── */}
        <div className="border border-slate-200 rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-slate-500">
              Select Pole Standard
            </p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4 flex-1 md:flex md:flex-col">
            {POLE_STANDARD_OPTIONS.map((option) => {
              const isActive = taperPoleStandard.poleType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      poleType: option.id,
                      groundPosition: "",
                      height: "",
                    })
                  }
                  className={`w-full rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium transition-all text-left
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

        {/* ── RIGHT: Ground Position + Diagram ── */}
        <div className="border border-slate-200 rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
          {/* ── Ground position header ── */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-4 flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-slate-500 flex-shrink-0">
              Ground Position
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                {GROUND_POSITION_OPTIONS.map((option) => {
                  const isActive =
                    taperPoleStandard.groundPosition === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isGroundDisabled}
                      onClick={() => {
                        if (isGroundDisabled) return;
                        onUpdate({ groundPosition: option.id, height: "" });
                      }}
                      className={`
                      flex items-center gap-2
                      rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium
                      transition-all duration-150 select-none
                      ${
                        isGroundDisabled
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          : isActive
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm cursor-pointer"
                            : "border-slate-200 text-slate-700 cursor-pointer hover:border-slate-300 hover:bg-slate-100"
                      }
                    `}
                    >
                      {/* Radio circle */}
                      <span
                        className={`
                        w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                        flex items-center justify-center transition-colors
                        ${
                          isGroundDisabled
                            ? "border-slate-300"
                            : isActive
                              ? "border-blue-500"
                              : "border-slate-400"
                        }
                      `}
                      >
                        {isActive && !isGroundDisabled && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {isGroundDisabled && (
                <span className="text-xs xl:text-sm text-slate-400 italic">
                  Select a pole standard first
                </span>
              )}
            </div>
          </div>

          {/* ── Diagram area ──
              bg-white  → belum ada gambar
              bg-slate-50 → sudah ada gambar
              fixed height → SVG tinggi tidak merusak layout
          ── */}
          <div
            className={`
          relative flex items-center justify-center overflow-hidden
          transition-colors duration-300
          py-8
          ${showDiagram ? "bg-slate-50" : "bg-white"}
        `}
          >
            {showDiagram ? (
              <div className="flex items-center justify-center gap-2 sm:gap-4 xl:gap-6 w-full px-4 sm:px-8">
                {/* Kiri: Height input */}
                <div className="xl:flex-shrink-0 w-[250px] xl:w-[200px]">
                  <div>
                    <span className="block text-gray-600 text-xs md:text-sm font-medium mb-2">
                      Height
                    </span>
                    <select
                      value={taperPoleStandard.height}
                      onChange={(e) => onUpdate({ height: e.target.value })}
                      className="w-full px-1 md:px-3 py-2 lg:py-2.5 border border-gray-300 rounded-lg hp:rounded-md text-xs md:text-sm min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] focus:border-[#1D4ED8] outline-none transition-all bg-white"
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
                  </div>
                </div>

                {/* Kanan: Diagram image — gambar yang tentukan tinggi container */}
                <div className="xl:flex-shrink-0 flex items-center">
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={`${taperPoleStandard.poleType} diagram`}
                    className="w-auto max-h-[860px] xl:max-h-[560px] object-contain transition-opacity duration-300"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-center px-8 py-10">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl hp:rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                  <Box className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm md:text-base font-medium text-slate-500">
                  {isGroundDisabled
                    ? "No pole standard selected"
                    : "No ground position selected"}
                </p>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-[300px]">
                  {isGroundDisabled
                    ? "Select a pole standard, then choose a ground position to unlock the diagram and height input."
                    : "Choose a ground position to view the diagram and fill in the height of structure."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer: Reset ── */}
      <div className="flex justify-between pt-5 border-t mt-6">
        <button
          type="button"
          onClick={() => onUpdate(EMPTY_POLE_STANDARD)}
          className="flex justify-center items-center text-sm gap-2 px-5 py-2.5 sm:py-2.5 lg:py-2.5 md:px-6 bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] rounded-lg hp:rounded-md 
          hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs"
        >
          <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
