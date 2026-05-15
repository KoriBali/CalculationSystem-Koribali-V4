import {
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  ClipboardPaste,
  CheckCircle,
  Circle,
} from "lucide-react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 */

// Generate dynamic input style based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Display small validation error text under input
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT
 */
export function OverheadWireForm({
  overheadWires,
  wireCountInput,
  setWireCountInput,
  onUpdate,
  errors,
  onAddOhw,
  onCopyOhw,
  onPasteOhw,
  hasClipboard,
  setConfirmDeleteOhw,
  resetCurrentOhw,
  handleAddOhw,
}) {
  // Convert input to number for validation
  const ohwValueNumber = Number(wireCountInput);

  // Validate OHW count input (must be 1–8)
  const isOhwInputValue =
    !wireCountInput ||
    isNaN(wireCountInput) ||
    ohwValueNumber <= 0 ||
    ohwValueNumber > 8;

  return (
    <div className="rounded-b-2xl shadow-sm border border-gray-200 overflow-hidden bg-white hp:rounded-b-xl">
      <div className="px-6 pt-6 pb-3 hp:px-4 hp:pt-4 hp:pb-2">
        <div>
          {/* HEADER OVERHEAD WIRE INPUT */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[#0d3b66] font-medium text-sm flex items-center gap-1 hp:text-xs">
                {/* Decorative line */}
                <div className="w-1 h-4 bg-[#3399cc] rounded-full mr-1 hp:h-4"></div>

                {/* Title */}
                <span className="font-semibold">
                  Configure up to 8 Overhead Wires
                </span>

                {/* Subtitle (hidden on small screen) */}
                <span className="hp:hidden">with detailed specifications</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT CONTROL SECTION */}
      <div className="border-b border-gray-200">
        <div
          className="
            flex items-center justify-start
            px-6 pt-3 pb-6
            hp:flex-col
            hp:items-stretch
            hp:gap-3
            hp:px-3
            hp:pt-2
          "
        >
          {/* INPUT + ACTION BUTTON */}
          <div
            className="
              flex items-center gap-3.5
              hp:gap-2
            "
          >
            {/* Current OHW count display */}
            <div
              className="
                flex items-center gap-2 px-5 py-2.5 text-sm rounded-md
                bg-slate-50 border border-slate-200 text-slate-700 font-medium
                hp:px-3
                hp:py-2
                hp:text-xs
                hp:justify-center
              "
            >
              <span className="text-[#0d3b66] font-semibold">
                {overheadWires.length}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">8 Overhead Wires</span>
            </div>

            {/* Input for number of OHW to add */}
            <input
              type="number"
              min={1}
              max={8}
              placeholder="Input OHW Number"
              value={wireCountInput}
              onChange={(e) => setWireCountInput(e.target.value)}
              onWheel={(e) => e.target.blur()}
              className="
                w-[180px] px-2.5 py-2.5 text-center text-sm rounded-md outline-none
                transition-all border border-slate-300 bg-white
                focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]
                hp:w-[120px]
                hp:px-1
                hp:py-2
                hp:text-xs
              "
            />

            {/* Confirm add OHW button */}
            <button
              onClick={onAddOhw}
              disabled={isOhwInputValue}
              className={`
                flex items-center gap-2 px-7 py-2.5 text-sm font-medium rounded-md
                transition-all border
                hp:px-6
                hp:py-2
                hp:text-xs
                    ${
                      isOhwInputValue
                        ? "bg-gray-50 border-gray-300 text-gray-600 opacity-40 cursor-not-allowed"
                        : "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
                    }`}
            >
              {/* Status icon (valid / invalid) */}
              {isOhwInputValue ? (
                <Circle className="w-4 h-4 text-gray-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
              OK
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {overheadWires.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-6 hp:text-xs hp:py-4">
          No Overhead Wire added yet
        </div>
      )}

      {/* LIST OF OHW FORMS */}
      {overheadWires.map((overheadWire, index) => {
        // Get error state for current OHW
        const ohwError = errors?.[overheadWire.idOhw] || {};

        // Check if last item
        const isLast = index === overheadWires.length - 1;

        // Check if multiple items exist
        const hasMultiple = overheadWires.length > 1;

        return (
          <div
            key={overheadWire.idOhw}
            className={`hover:bg-blue-50 p-6 
            ${hasMultiple && !isLast ? "border-b border-gray-200" : ""} hp:px-4 hp:pb-6 hp:pt-4`}
          >
            {/* Header pole title */}
            <div
              className="
                flex items-center justify-between
                mb-4 pb-4 border-b border-gray-200
                hp:flex-col
                hp:items-start
                hp:gap-4
              "
            >
              {/* TITLE + INDEX */}
              <div className="flex items-center gap-3">
                {/* Index badge */}
                <div
                  className="w-9 h-9 rounded-lg
                  bg-gradient-to-br from-[#0d3b66] to-[#3399cc]
                  flex items-center justify-center
                  text-white text-sm font-medium hp:w-8 hp:h-8"
                >
                  {index + 1}
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-base text-[#0d3b66] text-sm font-medium leading-snug hp:text-xs">
                    Overhead Wire{" "}
                    {overheadWire.name && `: ${overheadWire.name}`}
                  </h4>
                </div>
              </div>

              {/* ACTION BUTTONS (DESKTOP) */}
              <div className="flex items-center gap-6 hp:hidden">
                {/* COPY & PASTE */}
                <div className="flex items-center gap-2 ml-2">
                  {/* Copy OHW */}
                  <button
                    onClick={() => onCopyOhw(overheadWire)}
                    title="Copy this Overhead Wire"
                    className="p-2 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Paste OHW */}
                  <button
                    onClick={() => onPasteOhw(overheadWire.idOhw)}
                    disabled={!hasClipboard}
                    title={
                      hasClipboard
                        ? "Paste copied Overhead wire"
                        : "No copied Overhead wire"
                    }
                    className={`p-2 rounded-md border transition ${
                      hasClipboard
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>
                </div>

                {/* DIVIDER */}
                <div className="h-8 w-px bg-gray-300 opacity-70" />

                {/* RESET BUTTON */}
                <button
                  onClick={() => resetCurrentOhw(overheadWire.idOhw)}
                  className="flex items-center gap-2 px-5 py-2 h-[40px] bg-[#eef2f6] text-[#0d3b66] border border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition text-xs font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteOhw(overheadWire.idOhw);
                  }}
                  className="flex items-center gap-2 px-4 py-2 h-[40px] rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete OHW
                </button>
              </div>

              {/* ACTION BUTTONS (MOBILE) */}
              <div className="hidden hp:flex items-center justify-between gap-2 w-full">
                {/* LEFT: COPY & PASTE */}
                <div className="flex items-center gap-2">
                  {/* Copy OHW */}
                  <button
                    onClick={() => onCopyOhw(overheadWire)}
                    title="Copy"
                    className="h-8 w-8 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Paste OHW */}
                  <button
                    onClick={() => onPasteOhw(overheadWire.idOhw)}
                    disabled={!hasClipboard}
                    title="Paste"
                    className={`h-8 w-8 rounded-md border transition flex items-center justify-center ${
                      hasClipboard
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>
                </div>

                {/* RIGHT: RESET & DELETE */}
                <div className="flex items-center gap-2">
                  {/* RESET BUTTON */}
                  <button
                    onClick={() => resetCurrentOhw(overheadWire.idOhw)}
                    title="Reset"
                    className="h-8 w-8 rounded-md border bg-[#eef2f6] text-[#0d3b66] hover:bg-[#e2e8f0] transition flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteOhw(overheadWire.idOhw);
                    }}
                    title="Delete"
                    className="h-8 w-8 rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* FORM INPUT WRAPPER */}
            <div>
              <div
                className="
                  flex items-start space-x-2
                  hp:grid
                  hp:grid-cols-2
                  hp:gap-3
                  hp:space-x-0
                  hp:gap-y-6
                "
              >
                {/* Overhead Wire Name Input */}
                <div className="relative w-[200px] hp:w-full hp:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    OHW Name
                  </label>
                  <input
                    type="text"
                    value={overheadWire.name}
                    onChange={(e) =>
                      onUpdate(overheadWire.idOhw, { name: e.target.value })
                    }
                    placeholder="e.g., DV2.6-2C"
                    className={inputStyle(ohwError.name)}
                  />
                  <ErrorStyle show={ohwError.name} text={ohwError.name} />
                </div>

                {/* Weight Massa Overhead Wire Input */}
                <div className="relative w-[150px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={overheadWire.weight}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          weight: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.weight)} pr-10 hp:pr-10`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      kg/m
                    </span>
                  </div>
                  <ErrorStyle show={ohwError.weight} text={ohwError.weight} />
                </div>

                {/* Diameter Overhead Wire Input */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Diameter
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={overheadWire.diameter}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          diameter: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.diameter)} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      mm
                    </span>
                  </div>
                  <ErrorStyle
                    show={ohwError.diameter}
                    text={ohwError.diameter}
                  />
                </div>

                {/* Fix Height Overhead Wire Input */}
                <div className="relative w-[150px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Fix Height (Z)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={overheadWire.zHeight}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          zHeight: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.zHeight)} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      mm
                    </span>
                  </div>
                  <ErrorStyle show={ohwError.zHeight} text={ohwError.zHeight} />
                </div>

                {/* Span Overhead Wire Input */}
                <div className="relative w-[150px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Span
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={overheadWire.span}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          span: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.span)} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      mm
                    </span>
                  </div>
                  <ErrorStyle show={ohwError.span} text={ohwError.span} />
                </div>

                {/* Sagging Ratio Overhead Wire Input */}
                <div className="relative w-[125px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Sagging Ratio
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={overheadWire.saggingRatio}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          saggingRatio: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.saggingRatio)} pr-4 hp:pr-4`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      %
                    </span>
                  </div>
                  <ErrorStyle
                    show={ohwError.saggingRatio}
                    text={ohwError.saggingRatio}
                  />
                </div>

                {/* nnC Overhead Wire Input */}
                <div className="relative w-[125px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    nnC
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={overheadWire.nnC}
                    onChange={(e) =>
                      onUpdate(overheadWire.idOhw, {
                        nnC: e.target.value,
                      })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputStyle(ohwError.nnC)}`}
                  />
                  <ErrorStyle show={ohwError.nnC} text={ohwError.nnC} />
                </div>

                {/* Fix Angle Overhead Wire Input */}
                <div className="relative w-[130px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Fix Angle
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={overheadWire.fixAngle}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          fixAngle: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(ohwError.fixAngle)} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      deg
                    </span>
                  </div>
                  <ErrorStyle
                    show={ohwError.fixAngle}
                    text={ohwError.fixAngle}
                  />
                </div>

                {/* Vertical Angle Overhead Wire Input */}
                <div className="relative w-[130px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Vertical Angle
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={overheadWire.verticalAngle}
                      onChange={(e) =>
                        onUpdate(overheadWire.idOhw, {
                          verticalAngle: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(
                        ohwError.verticalAngle,
                      )} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      deg
                    </span>
                  </div>
                  <ErrorStyle
                    show={ohwError.verticalAngle}
                    text={ohwError.verticalAngle}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* FOOTER: LEFT (Reset Button) & RIGHT (Next Input) */}
      <div className="flex justify-center items-center p-6 hp:p-4">
        {/* Add Button */}
        <button
          onClick={handleAddOhw}
          disabled={overheadWires.length >= 8}
          className={`
            w-full py-2.5 font-medium text-sm rounded-lg
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              overheadWires.length >= 8
                ? "border-2 border-dashed border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                : "border-2 border-dashed border-[#3399cc] text-[#3399cc] bg-transparent hover:bg-[#3399cc] hover:text-white"
            }
            hp:text-xs hp:px-[22px]
          `}
        >
          <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
          Add OHW
        </button>
      </div>
    </div>
  );
}
