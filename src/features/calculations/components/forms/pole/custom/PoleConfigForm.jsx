/**
 * IMAGES
 */
const onGlImg = "/images/on-gl.svg";
const upperGlImg = "/images/upper-gl.svg";
const underGlImg = "/images/under-gl.svg";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm outline-none transition-all border min-h-[42px]
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

// Maps groundPosition to its corresponding diagram image
const imageMap = {
  onGL: onGlImg,
  upperGL: upperGlImg,
  underGL: underGlImg,
};

// Ground position options for the radio button group
const groundPositionOptions = [
  { id: "onGL", label: "On GL" },
  { id: "upperGL", label: "Upper GL" },
  { id: "underGL", label: "Under GL" },
];

/**
 * MAIN COMPONENT: PoleConfigForm
 */
export function PoleConfigForm({
  poleConfig, // object — { lowestHeight, groundPosition, overdesignFactor }
  onUpdate, // fn — called on any field change
  errors, // object — validation errors per field
}) {
  const { lowestHeight, groundPosition, overdesignFactor } = poleConfig;

  // onGL mode disables the lowest height input (value is fixed at 0)
  const isOnGL = groundPosition === "onGL";
  const currentImage = imageMap[groundPosition] || onGlImg;

  const handleModeChange = (mode) => onUpdate({ groundPosition: mode });

  return (
    <div>
      <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-6">
          {/* ── Ground Position Selector ── */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Select Ground Position
            </label>

            {/* Radio button group */}
            <div className="flex gap-3 mb-4">
              {groundPositionOptions.map((opt) => {
                const isActive = groundPosition === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleModeChange(opt.id)}
                    className={`w-48 cursor-pointer text-sm rounded-lg border px-4 py-2.5 transition-all flex items-center gap-3
                      ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    {/* Custom radio indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${isActive ? "border-blue-500" : "border-gray-400"}`}
                    >
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Diagram area — shows image + lowest height input */}
            <div className="flex justify-center gap-5 items-center bg-gray-50 border rounded-lg p-4 h-72 2040:h-80 overflow-hidden">
              {/* Lowest height input — disabled when mode is onGL */}
              {groundPosition && (
                <div className="flex flex-col justify-end pb-6 h-full">
                  <div className="flex flex-col">
                    <span className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-3">
                      Lowest Height
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        value={lowestHeight}
                        placeholder="Input Lowest Height"
                        disabled={isOnGL}
                        onChange={(e) =>
                          !isOnGL && onUpdate({ lowestHeight: e.target.value })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(errors.lowestHeight)} w-[200px] pr-7 ${isOnGL ? "bg-gray-100 text-gray-400" : ""}`}
                      />
                      <span className="absolute right-4 text-xs md:text-sm top-1/2 -translate-y-1/2 text-gray-400">
                        m
                      </span>
                    </div>
                    <ErrorStyle
                      show={errors.lowestHeight}
                      text={errors.lowestHeight}
                    />
                  </div>
                </div>
              )}

              {/* Diagram image — changes based on selected ground position */}
              <img
                key={currentImage}
                src={currentImage}
                alt="Ground position diagram"
                className="h-full object-contain transition-all duration-300"
              />
            </div>
          </div>

          {/* ── Overdesign Factor ── */}
          <div className="relative">
            <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-3">
              Overdesign Factor
            </label>
            <input
              type="number"
              min={0}
              value={overdesignFactor}
              onChange={(e) => onUpdate({ overdesignFactor: e.target.value })}
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(errors.overdesignFactor)} w-full`}
            />
            <ErrorStyle
              show={errors.overdesignFactor}
              text={errors.overdesignFactor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
