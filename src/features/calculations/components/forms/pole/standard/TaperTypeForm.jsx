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
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
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
    <div className="bg-white px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Section title ── */}
      <div className="mb-4">
        <SectionTitle>Pole Standard Configuration</SectionTitle>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-4 hp:gap-3">
        {/* ── LEFT: Pole Type ── */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <p className="text-sm font-medium text-slate-500">
              Select Pole Standard
            </p>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-all text-left
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-600"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Ground Position + Diagram ── */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
          {/* ── Ground position header ── */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-4 flex-shrink-0">
            <p className="text-sm font-medium text-slate-500 flex-shrink-0">
              Ground Position
            </p>

            <div className="flex gap-2">
              {GROUND_POSITION_OPTIONS.map((option) => {
                const isActive = taperPoleStandard.groundPosition === option.id;

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
                      rounded-lg border px-4 py-2 text-sm font-medium
                      transition-all duration-150 select-none
                      ${
                        isGroundDisabled
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          : isActive
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm cursor-pointer"
                            : "border-slate-200 text-slate-600 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-600 active:scale-[0.97]"
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
              <span className="text-sm text-slate-400 italic">
                Select a pole standard first
              </span>
            )}
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
              h-[620px] 2040:h-[670px]
              ${showDiagram ? "bg-slate-50" : "bg-white"}
            `}
          >
            {showDiagram ? (
              /* ── input kiri, gambar kanan, keduanya di-center ── */
              <div className="flex items-center justify-center gap-6 w-full h-full px-8">
                {/* Kiri: Height of Structure input */}
                <div className="flex-shrink-0 w-[200px]">
                  <div>
                    <span className="block text-gray-600 text-sm font-medium mb-2 hp:text-[10px]">
                      Height of Structure
                    </span>
                    <select
                      value={taperPoleStandard.height}
                      onChange={(e) => onUpdate({ height: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[38px] focus:border-[#1D4ED8] outline-none transition-all bg-white hp:text-xs"
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

                {/* Kanan: Diagram image */}
                <div className="flex-shrink-0 h-full flex items-center">
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={`${taperPoleStandard.poleType} ${
                      taperPoleStandard.groundPosition === "onGL"
                        ? "On GL"
                        : "Under GL"
                    } diagram`}
                    style={{ height: "560px" }}
                    className="w-auto object-contain transition-opacity duration-300"
                  />
                </div>
              </div>
            ) : (
              /* ── Empty state ── */
              <div className="flex flex-col items-center justify-center gap-3 text-center px-8 py-10">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                  <Box className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-base font-medium text-slate-500">
                  {isGroundDisabled
                    ? "No pole standard selected"
                    : "No ground position selected"}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[300px]">
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
          className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
        >
          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
