import React, { useState, useEffect, useMemo } from "react";

/**
 * Clean & Modern Adaptive Ground Position Input
 * - Input position naturally centered vertically in the row.
 * - (h) label marker in input label and in the center of the CAD dimension line.
 * - Text "GL" positioned on the RIGHT side of the pole to avoid collision with dimension line.
 * - Status pill badge (On GL / Upper GL / Under GL) aligned directly with the top of the diagram (gap = 0).
 * - Fixed Ground Level (GL) at y = 88 with 45° ground hatch.
 * - Tall slender pole (starts at y = 4) and wide baseplate (width = 56px).
 * - When On GL (0 mm): no arrow clutter, clean baseplate on ground line.
 * - Default input value is "0" directly with auto-select on focus.
 */
export function AdaptiveGroundPositionInput({
  value = "0",
  groundPosition = "onGL",
  onChange,
  error = null,
  disabled = false,
  label = "Lowest Height",
  required = true,
  title = "Baseplate",
}) {
  // Default is "0" directly as requested
  const [localInput, setLocalInput] = useState(() => {
    if (value === undefined || value === null || value === "") {
      return "0";
    }
    return String(value);
  });

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const str = String(value);
      if (str !== localInput && localInput !== "-") {
        setLocalInput(str === "" ? "0" : str);
      }
    }
  }, [value]);

  const numValue = useMemo(() => {
    if (localInput === "" || localInput === "-" || isNaN(Number(localInput))) {
      return 0;
    }
    return Number(localInput);
  }, [localInput]);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setLocalInput(raw);

    if (raw === "") {
      onChange?.({ lowestHeight: "", groundPosition: "onGL" });
      return;
    }

    if (raw === "-") {
      return;
    }

    const parsed = Number(raw);
    if (!isNaN(parsed)) {
      const nextPos =
        parsed === 0 ? "onGL" : parsed > 0 ? "upperGL" : "underGL";
      onChange?.({ lowestHeight: raw, groundPosition: nextPos });
    }
  };

  const handleBlur = () => {
    if (localInput === "" || localInput === "-") {
      setLocalInput("0");
      onChange?.({ lowestHeight: "0", groundPosition: "onGL" });
    }
  };

  const absVal = Math.abs(numValue);
  const isUpperGL = numValue > 0;
  const isUnderGL = numValue < 0;

  // Ground Level (GL) is permanently FIXED at y = 135
  const GL_Y = 135;

  // Upper GL: Pedestal rises above GL, capped so pole above always stays tall (min 90px)
  const pedestalHeight = useMemo(() => {
    if (!isUpperGL) return 0;
    return Math.min(
      32,
      Math.max(14, Math.round(12 + Math.min(20, absVal / 25))),
    );
  }, [isUpperGL, absVal]);

  // Under GL: Pole extends downwards INTO the ground below GL
  const buriedDepth = useMemo(() => {
    if (!isUnderGL) return 0;
    return Math.min(
      26,
      Math.max(14, Math.round(12 + Math.min(14, absVal / 25))),
    );
  }, [isUnderGL, absVal]);

  // Baseplate Y position (baseplate height = 5):
  // - On GL (0): rests on GL (y = 130 to 135)
  // - Upper GL (> 0): elevated above GL by pedestalHeight
  // - Under GL (< 0): sinks below GL into the ground by buriedDepth
  const baseplateY = isUpperGL
    ? GL_Y - 5 - pedestalHeight
    : isUnderGL
      ? GL_Y + buriedDepth
      : GL_Y - 5;

  // Pole bottom connects directly to the top of the baseplate
  const poleBottomY = baseplateY;

  // Midpoint of the dimension line for placing the (h) marker
  const bracketMidY = useMemo(() => {
    return (GL_Y + baseplateY + 2.5) / 2;
  }, [GL_Y, baseplateY]);

  // Ensure label has (h)
  const displayLabel = useMemo(() => {
    return label.includes("(h)") ? label : `${label} (h)`;
  }, [label]);

  return (
    <div className="flex flex-col gap-2 bg-white w-full">
      {/* ── Header: Title Only ── */}
      {title && (
        <div className="flex items-center justify-between pb-1">
          <p className="text-xs md:text-sm font-semibold text-[#0d3b66]">
            {title}
          </p>
        </div>
      )}

      {/* ── Content Row: Input on left, Diagram on right ── */}
      <div className="flex hp:flex-col flex-row items-center justify-center h-56 hp:h-auto gap-4 sm:gap-6">
        {/* Left Side: Standard Form Input Field (Naturally centered vertically in row) */}
        <div className="w-44 sm:w-52 hp:w-full">
          <label className="block text-xs md:text-sm mb-2 text-gray-700">
            {displayLabel}{" "}
            {required && (
              <span className="text-red-500 ml-1 font-semibold">*</span>
            )}
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={localInput}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              onBlur={handleBlur}
              onWheel={(e) => e.target.blur()}
              disabled={disabled}
              className={`w-full pl-3 md:pl-4 pr-9 py-2 lg:py-2.5 rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                disabled
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : error
                    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200 text-gray-900"
                    : "border-gray-300 bg-white text-gray-900 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
              }`}
            />
            <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          {error && <p className="text-[10px] text-red-500 mt-1">*{error}</p>}
        </div>

        {/* Right Side: Diagram Container with Previous Clean HTML Status Pill */}
        <div className="relative inline-flex items-center justify-center shrink-0">
          {/* Status Pill Badge - Previous Clean HTML Style (Shadow, border, rounded-full, with increased 15px gap to the pole) */}
          <div
            className="absolute top-1 z-10 pointer-events-none whitespace-nowrap"
            style={{ left: "calc(53.3% + 15px)" }}
          >
            {numValue === 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                On GL (0 mm)
              </span>
            )}
            {numValue > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Upper GL (+{numValue} mm)
              </span>
            )}
            {numValue < 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Under GL ({numValue} mm)
              </span>
            )}
          </div>

          {/* SVG Diagram - Taller ViewBox (165x175) so pole is prominently taller */}
          <svg
            width="165"
            height="175"
            viewBox="0 0 165 175"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-52 w-auto object-contain select-none shrink-0"
            role="img"
            aria-label="Baseplate Diagram"
          >
            <defs>
              {/* Modern Polished Steel Pole Gradient */}
              <linearGradient
                id="modernPoleGrad"
                x1="64"
                y1="0"
                x2="88"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#475569" />
                <stop offset="0.25" stopColor="#E2E8F0" />
                <stop offset="0.5" stopColor="#94A3B8" />
                <stop offset="1" stopColor="#475569" />
              </linearGradient>

              {/* Modern Brushed Steel Baseplate Gradient */}
              <linearGradient
                id="modernBaseplateGrad"
                x1="41"
                y1="0"
                x2="111"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#64748B" />
                <stop offset="0.5" stopColor="#CBD5E1" />
                <stop offset="1" stopColor="#64748B" />
              </linearGradient>

              {/* Modern Architectural Concrete Pedestal Gradient */}
              <linearGradient
                id="modernPedestalGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#E2E8F0" />
              </linearGradient>

              {/* 45-degree Architectural Soil Hatch Texture */}
              <pattern
                id="groundHatchPattern"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="#a2afc0"
                  strokeWidth="1"
                />
              </pattern>

              {/* Distinct CAD Arrowhead (harmonized stroke & size) */}
              <marker
                id="thinCadArrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7.5"
                markerHeight="7.5"
                orient="auto"
              >
                <polyline
                  points="1.5,1.5 8,5 1.5,8.5"
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            {/* ── Ground Soil Hatch Texture below GL Line (y = 135 down to 175) ── */}
            <rect
              x="6"
              y={GL_Y}
              width="159"
              height={Math.max(0, 175 - GL_Y)}
              fill="url(#groundHatchPattern)"
            />

            {/* ── Concrete Pedestal (when Upper GL: rises from GL_Y up to baseplate, width = 70px) ── */}
            {isUpperGL && (
              <rect
                x="41"
                y={baseplateY + 5}
                width="70"
                height={Math.max(0, GL_Y - (baseplateY + 5))}
                fill="url(#modernPedestalGrad)"
                stroke="#CBD5E1"
                strokeWidth="0.8"
                rx="1"
                style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            )}

            {/* ── Excavation Pit outline (when Under GL: pole sinks into ground, width = 70px) ── */}
            {isUnderGL && (
              <rect
                x="41"
                y={GL_Y}
                width="70"
                height={Math.max(0, baseplateY + 5 - GL_Y)}
                fill="#F8FAFC"
                stroke="#94A3B8"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            )}

            {/* ── Fixed Ground Line (GL at y = 135) ── */}
            <line
              x1="6"
              y1={GL_Y}
              x2="165"
              y2={GL_Y}
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* ── Text "GL" (Positioned on the RIGHT side of the pole next to baseplate/pedestal) ── */}
            <text
              x="118"
              y={GL_Y - 4}
              fill="#0F172A"
              fontSize="12"
              fontWeight="800"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="0.05em"
            >
              GL
            </text>

            {/* ── Tall Metallic Pole & Proportional Baseplate Assembly ── */}
            <g style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              {/* Tall Metallic Pole Body (Starts high at y = 6, height = up to 124px on GL) */}
              <rect
                x="64"
                y="6"
                width="24"
                height={Math.max(50, poleBottomY - 6)}
                fill="url(#modernPoleGrad)"
                stroke="#334155"
                strokeWidth="0.8"
              />

              {/* Balanced Brushed Steel Baseplate (width = 70px, centered with pole) */}
              <rect
                x="41"
                y={baseplateY}
                width="70"
                height="5"
                fill="url(#modernBaseplateGrad)"
                stroke="#334155"
                strokeWidth="0.8"
                rx="1.5"
              />
            </g>

            {/* ── Blue CAD Dimension Line with Harmonized (h) placed on the LEFT side of the line ── */}
            {numValue ===
            0 ? /* On GL (0 mm): Clean view with NO arrow clutter */
            null : (
              /* Upper GL or Under GL: Dimension bracket with balanced line weight and (h) */
              <g
                style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
              >
                {/* Horizontal tick at GL */}
                <line
                  x1="14"
                  y1={GL_Y}
                  x2="24"
                  y2={GL_Y}
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />
                {/* Continuous vertical line spanning from GL to Baseplate */}
                <line
                  x1="22"
                  y1={GL_Y}
                  x2="22"
                  y2={baseplateY + 2.5}
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />
                {/* Horizontal line with clear arrow pointing to Baseplate */}
                <line
                  x1="22"
                  y1={baseplateY + 2.5}
                  x2="40"
                  y2={baseplateY + 2.5}
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                  markerEnd="url(#thinCadArrow)"
                />
                {/* Harmonized (h) text with clean semibold weight matching the line */}
                <text
                  x="17"
                  y={bracketMidY + 4.5}
                  textAnchor="end"
                  fill="#1D4ED8"
                  fontSize="12.5"
                  fontWeight="600"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                >
                  (h)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AdaptiveGroundPositionInput;
