import { useEffect, useState } from "react";
import { RotateCcw, Box, ChevronRight, Loader2 } from "lucide-react";
import { GROUND_POSITION_OPTIONS } from "../../../../constants/taperPoleStandradOptions";
import { usePoleStandardData } from "../../../../hooks/usePoleStandardData";
import { ConfirmResetAllModal } from "../../../modals/ConfirmResetAllModal";

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

// Embedment variant (used when !isBaseplate) for each pole type
const EMBED_IMAGE_MAP = Object.fromEntries(
  Object.keys(DIAGRAM_IMAGE_MAP).map((type) => [type, `/images/${type}-Type-Embed.svg`])
);

const ALL_DIAGRAM_IMAGES = [
  ...Object.values(DIAGRAM_IMAGE_MAP).flatMap((byGround) => Object.values(byGround)),
  ...Object.values(EMBED_IMAGE_MAP),
];

// Module-level so the 18 SVGs are only ever fetched once per browser session,
// even if this form mounts/unmounts multiple times while navigating.
const preloadedDiagrams = new Set();

// fetchPriority "low" so this background warm-up never competes for
// bandwidth with the diagram the user is actually waiting to see right now.
const preloadDiagrams = (urls) => {
  urls.forEach((src) => {
    if (preloadedDiagrams.has(src)) return;
    preloadedDiagrams.add(src);
    const img = new Image();
    img.fetchPriority = "low";
    img.src = src;
  });
};

// === HELPERS ===
// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <p className="mt-1.5 text-[11px] md:text-xs text-red-500">*{text}</p>
  ) : null;

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

export function TaperPoleStandardForm({ taperPoleStandard, onUpdate, hideReset = false, isBaseplate = true, errors = {} }) {
  const {
    poleStandardOptions,
    heightOptionsByStandard,
    loading: poleStandardLoading,
    error: poleStandardError,
    refetch: refetchPoleStandard,
  } = usePoleStandardData();

  // Tracks which diagram URLs have already finished loading, so re-selecting
  // a pole type/ground position already shown once never re-shows a skeleton.
  const [loadedImages, setLoadedImages] = useState(() => new Set());

  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (!isBaseplate && taperPoleStandard.poleType && taperPoleStandard.groundPosition !== "underGL") {
      onUpdate({ groundPosition: "underGL", height: "" });
    }
  }, [isBaseplate, taperPoleStandard.poleType, taperPoleStandard.groundPosition, onUpdate]);

  // Warm the browser cache with every pole diagram in the background so
  // switching pole type / ground position later never shows a blank flash.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => preloadDiagrams(ALL_DIAGRAM_IMAGES));
    return () => cancelIdle(id);
  }, []);
  const currentHeightOptions =
    heightOptionsByStandard[taperPoleStandard.poleType] ??
    EMPTY_HEIGHT_OPTIONS;

  const currentImage =
    taperPoleStandard.poleType && taperPoleStandard.groundPosition
      ? (!isBaseplate && taperPoleStandard.groundPosition === "underGL"
        ? EMBED_IMAGE_MAP[taperPoleStandard.poleType]
        : DIAGRAM_IMAGE_MAP[taperPoleStandard.poleType]?.[
        taperPoleStandard.groundPosition
        ] ?? null)
      : null;

  const isGroundDisabled = !taperPoleStandard.poleType;
  const showDiagram = !!currentImage;
  const isImageLoaded = currentImage ? loadedImages.has(currentImage) : false;

  const activeGroundOptions = isBaseplate
    ? GROUND_POSITION_OPTIONS
    : [{ id: "underGL", label: "Embedment" }];

  return (
    <div className="bg-white px-4 md:px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Section title ── */}
      <div className="mb-4">
        <SectionTitle>Pole Configuration</SectionTitle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 hp:gap-3">
        {/* ── LEFT: Pole Type ── */}
        <div
          id="taperPoleStandard.poleType"
          className={`border rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col ${
            errors.poleType ? "border-red-300" : "border-slate-200"
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-slate-500">
              Pole Standard Type
            </p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4 flex-1 md:flex md:flex-col">
            {poleStandardLoading && poleStandardOptions.length === 0 && (
              <p className="text-xs sm:text-sm text-slate-400">
                Loading pole standard options...
              </p>
            )}
            {!poleStandardLoading && poleStandardError && poleStandardOptions.length === 0 && (
              <div className="col-span-2 md:col-span-1 flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
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
            )}
            {poleStandardOptions.map((option) => {
              const isActive = taperPoleStandard.poleType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      poleType: option.id,
                      groundPosition: !isBaseplate ? "underGL" : "",
                      height: "",
                    })
                  }
                  className={`w-full rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium transition-all text-left
                  ${isActive
                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {errors.poleType && (
            <div className="px-4 pb-3">
              <ErrorStyle show={errors.poleType} text={errors.poleType} />
            </div>
          )}
        </div>

        {/* ── RIGHT: Ground Position + Diagram ── */}
        <div
          className={`border rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col ${
            errors.groundPosition ? "border-red-300" : "border-slate-200"
          }`}
        >
          {/* ── Ground position header ── */}
          <div id="taperPoleStandard.groundPosition" className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-4 flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-slate-500 flex-shrink-0">
              Ground Position
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                {activeGroundOptions.map((option) => {
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
                      ${isGroundDisabled
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
                        ${isGroundDisabled
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
              <ErrorStyle show={errors.groundPosition} text={errors.groundPosition} />
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
          py-8 h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px] xl:h-[750px]
          ${showDiagram ? "bg-slate-50" : "bg-white"}
        `}
          >
            {showDiagram ? (
              <div className="flex items-center justify-center gap-2 sm:gap-4 xl:gap-6 w-full px-4 sm:px-8 h-full">
                {/* Kiri: Height input */}
                <div className="xl:flex-shrink-0 w-[150px] xl:w-[140px]">
                  <div>
                    <span className="block text-gray-600 text-xs md:text-sm font-medium mb-2">
                      Height
                    </span>
                    <div className="relative">
                      <select
                        id="taperPoleStandard.height"
                        value={taperPoleStandard.height}
                        onChange={(e) => onUpdate({ height: e.target.value })}
                        className={`w-full px-1 md:px-3 py-2 lg:py-2.5 border rounded-lg hp:rounded-md text-xs md:text-sm min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] outline-none transition-all bg-white appearance-none ${
                          errors.height
                            ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
                            : "border-gray-300 focus:border-[#1D4ED8]"
                        }`}
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
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                      </div>
                    </div>
                    <ErrorStyle show={errors.height} text={errors.height} />
                  </div>
                </div>

                {/* Kanan: Diagram image — gambar yang tentukan tinggi container */}
                <div className="xl:flex-shrink-0 relative flex items-center justify-center h-full min-w-[80px]">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[11px] md:text-xs">Loading diagram...</span>
                    </div>
                  )}
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={`${taperPoleStandard.poleType} diagram`}
                    onLoad={() =>
                      setLoadedImages((prev) => new Set(prev).add(currentImage))
                    }
                    className={`w-auto h-full max-h-full object-contain transition-opacity duration-300 ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>

                {/* Kanan Gambar: Embedment Input */}
                {!isBaseplate && taperPoleStandard.groundPosition === "underGL" && (
                  <div className="self-end pb-0 mb-0 -translate-y-3 xl:-translate-y-0.5 xl:flex-shrink-0 w-[110px] sm:w-[130px]">
                    <span className="block text-gray-600 text-xs md:text-sm font-medium mb-2">
                      Embedment Length
                    </span>
                    <div className="relative">
                      <input
                        id="taperPoleStandard.embedmentLength"
                        type="number"
                        min="0"
                        value={taperPoleStandard.embedmentLength || ""}
                        onChange={(e) => onUpdate({ embedmentLength: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        className={`w-full px-2 py-1.5 md:py-2 lg:py-2.5 border rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all pr-8 md:pr-10 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] ${
                          errors.embedmentLength
                            ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
                            : "border-gray-300 focus:border-[#1D4ED8]"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm pointer-events-none">
                        mm
                      </span>
                    </div>
                    <ErrorStyle show={errors.embedmentLength} text={errors.embedmentLength} />
                  </div>
                )}
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
                    ? "Select a standard type to continue. Ground position and pole dimensions will become available."
                    : "Choose a ground position to view the pole diagram and fill in the height of structure."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer: Reset ── */}
      {!hideReset && (
        <div className="flex justify-between pt-5 border-t mt-6">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex justify-center items-center text-sm gap-2 px-5 py-2.5 sm:py-2.5 lg:py-2.5 md:px-6 bg-white text-red-400 border border-gray-200 rounded-lg hp:rounded-md
            hover:bg-red-50 hover:border-red-200 transition-colors font-medium hp:text-xs"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>
        </div>
      )}

      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={() => onUpdate(EMPTY_POLE_STANDARD)}
        title="Reset all inputs on this section?"
        description="This will clear all inputs entered in this section. This action cannot be undone."
      />
    </div>
  );
}
