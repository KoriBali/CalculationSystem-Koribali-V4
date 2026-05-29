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
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md sm:rounded-lg outline-none transition-all text-xs md:text-sm border
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
export function ArmObjectForm({
  armObjects = [],
  aoCountInput,
  setAoCountInput,
  onUpdate,
  errors,
  onAddAo,
  onCopyAo,
  onPasteAo,
  hasClipboard,
  setConfirmDeleteAo,
  resetCurrentAo,
  handleAddAo,
}) {
  // Convert input to number for validation
  const aoValueNumber = Number(aoCountInput);

  // Validate object count input (must be 1–5)
  const isAoInputValue =
    !aoCountInput ||
    isNaN(aoCountInput) ||
    aoValueNumber <= 0 ||
    aoValueNumber > 5;

  return (
    <div className="shadow-sm border border-gray-200 overflow-hidden bg-white">
      <div className="px-6 pt-6 pb-3 hp:px-4 hp:pt-4 hp:pb-2">
        <div>
          {/* HEADER ARM OBJECT INPUT */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[#0d3b66] font-medium text-sm flex items-center gap-1 hp:text-xs">
                {/* Decorative line */}
                <div className="w-1 h-5 bg-[#3399cc] rounded-full mr-1 hp:h-4"></div>

                {/* Title */}
                <span className="font-semibold">
                  Configure up to 5 Arm Objects
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
            flex items-center justify-between
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
              flex items-center gap-3
              hp:gap-2
            "
          >
            {/* Current object count display */}
            <div
              className="
                flex items-center gap-2 px-5 py-2.5 text-sm rounded-md sm:rounded-lg
                bg-slate-50 border border-slate-200 text-slate-700 font-medium
                hp:px-3
                hp:py-2
                hp:text-xs
                hp:justify-center
              "
            >
              <span className="text-[#0d3b66] font-semibold">
                {armObjects.length}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">5 Arm Objects</span>
            </div>

            {/* Input for number of object to add */}
            <input
              type="number"
              min={1}
              max={5}
              placeholder="Input Object Number"
              value={aoCountInput}
              onChange={(e) => setAoCountInput(e.target.value)}
              onWheel={(e) => e.target.blur()}
              className="
                w-[180px] px-3.5 py-2.5 text-center text-sm rounded-md sm:rounded-lg outline-none
                transition-all border border-slate-300 bg-white
                focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]
                hp:w-[120px]
                hp:px-1
                hp:py-2
                hp:text-xs
              "
            />

            {/* Confirm add object button */}
            <button
              onClick={onAddAo}
              disabled={isAoInputValue}
              className={`
                flex items-center gap-2 px-7 py-2.5 text-sm font-medium rounded-md sm:rounded-lg
                transition-all border
                hp:px-6
                hp:py-2
                hp:text-xs
                ${
                  isAoInputValue
                    ? "bg-gray-50 border-gray-300 text-gray-600 opacity-40 cursor-not-allowed"
                    : "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
                }
              `}
            >
              {/* Status icon (valid / invalid) */}
              {isAoInputValue ? (
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
      {armObjects.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-6 hp:text-xs hp:py-4">
          No Arm Object added yet
        </div>
      )}

      {/* LIST OF ARM OBJECT FORMS */}
      {armObjects.map((armObject, index) => {
        // Get error state for current object
        const aoError = errors?.[armObject.idAo] || {};

        // Check if last item
        const isLast = index === armObjects.length - 1;

        // Check if multiple items exist
        const hasMultiple = armObjects.length > 1;

        return (
          <div
            key={armObject.idAo}
            className={`hover:bg-blue-50 p-6 
            ${hasMultiple && !isLast ? "border-b border-gray-200" : ""} hp:px-4 hp:pb-6 hp:pt-4`}
          >
            {/* Header section title */}
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
                  className="w-9 h-9 rounded-md sm:rounded-lg
                  bg-gradient-to-br from-[#0d3b66] to-[#3399cc]
                  flex items-center justify-center
                  text-white text-sm font-medium hp:w-8 hp:h-8"
                >
                  {index + 1}
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-base text-[#0d3b66] text-sm font-medium leading-snug hp:text-xs">
                    Arm Object
                    {armObject.name && ` : ${armObject.name}`}
                  </h4>
                  <p className="text-xs text-gray-500 hp:text-[10px]">
                    {armObject.type} Type
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS (DESKTOP) */}
              <div className="flex items-center gap-6 hp:hidden">
                {/* COPY & PASTE */}
                <div className="flex items-center gap-2 ml-2">
                  {/* Copy Object */}
                  <button
                    onClick={() => onCopyAo(armObject)}
                    title="Copy this Arm Object"
                    className="p-2 rounded-md sm:rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Paste Object */}
                  <button
                    onClick={() => onPasteAo(armObject.idAo)}
                    disabled={!hasClipboard}
                    title={
                      hasClipboard
                        ? "Paste copied Arm Object"
                        : "No copied Arm Object"
                    }
                    className={`p-2 rounded-md sm:rounded-lg border transition ${
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
                  onClick={() => resetCurrentAo(armObject.idAo)}
                  className="flex items-center gap-2 px-5 py-2 h-[40px] bg-[#eef2f6] text-[#0d3b66] border border-[#d0d7e2] rounded-md sm:rounded-lg hover:bg-[#e2e8f0] transition text-xs font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteAo(armObject.idAo);
                  }}
                  className="flex items-center gap-2 px-4 py-2 h-[40px] rounded-md sm:rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Object
                </button>
              </div>

              {/* ACTION BUTTONS (MOBILE) */}
              <div className="hidden hp:flex items-center justify-between gap-2 w-full">
                {/* LEFT: COPY & PASTE */}
                <div className="flex items-center gap-2">
                  {/* Copy Object */}
                  <button
                    onClick={() => onCopyAo(armObject)}
                    title="Copy"
                    className="h-8 w-8 rounded-md sm:rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Paste Object */}
                  <button
                    onClick={() => onPasteAo(armObject.idAo)}
                    disabled={!hasClipboard}
                    title="Paste"
                    className={`h-8 w-8 rounded-md sm:rounded-lg border transition flex items-center justify-center ${
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
                    onClick={() => resetCurrentAo(armObject.idAo)}
                    title="Reset"
                    className="h-8 w-8 rounded-md sm:rounded-lg border bg-[#eef2f6] text-[#0d3b66] hover:bg-[#e2e8f0] transition flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteAo(armObject.idAo);
                    }}
                    title="Delete"
                    className="h-8 w-8 rounded-md sm:rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* FORM CARD WRAPPER */}
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
                {/* Arm Object Name Input */}
                <div className="relative w-[200px] hp:w-full hp:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Object Name
                  </label>
                  <input
                    type="text"
                    value={armObject.name}
                    onChange={(e) =>
                      onUpdate(armObject.idAo, { name: e.target.value })
                    }
                    placeholder="e.g., 感知器"
                    className={inputStyle(aoError.name)}
                  />
                  <ErrorStyle show={aoError.name} text={aoError.name} />
                </div>

                {/* Type of Arm Object Selector */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Type
                  </label>
                  <select
                    value={armObject.type}
                    onChange={(e) =>
                      onUpdate(armObject.idAo, { type: e.target.value })
                    }
                    className={`${inputStyle(aoError.type)} min-h-[38px]`}
                  >
                    <option value="omni">Omni</option>
                    <option value="directional">Directional</option>
                  </select>
                  <ErrorStyle show={aoError.type} text={aoError.type} />
                </div>

                {/* Front Area Arm Object Input */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Front Area
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={armObject.frontArea}
                      onChange={(e) =>
                        onUpdate(armObject.idAo, {
                          frontArea: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(aoError.frontArea)} pr-6 hp:py-[9.5px] hp:pr-6`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      m<sup>2</sup>
                    </span>
                  </div>
                  <ErrorStyle
                    show={aoError.frontArea}
                    text={aoError.frontArea}
                  />
                </div>

                {/* Side Area Arm Object Input */}
                {armObject.type === "directional" && (
                  <div className="relative w-[140px] hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Side Area
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={armObject.sideArea}
                        onChange={(e) =>
                          onUpdate(armObject.idAo, {
                            sideArea: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(aoError.sideArea)} pr-6 hp:pr-6`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                        m<sup>2</sup>
                      </span>
                    </div>
                    <ErrorStyle
                      show={aoError.sideArea}
                      text={aoError.sideArea}
                    />
                  </div>
                )}

                {/* Weight Arm Object Input */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={armObject.weight}
                      onChange={(e) =>
                        onUpdate(armObject.idAo, {
                          weight: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(aoError.weight)} pr-6 hp:pr-6`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      kg
                    </span>
                  </div>
                  <ErrorStyle show={aoError.weight} text={aoError.weight} />
                </div>

                {/* H-distance Arm Object Input */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    H-Distance
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={armObject.hDistance}
                      onChange={(e) =>
                        onUpdate(armObject.idAo, {
                          hDistance: e.target.value,
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(aoError.hDistance)} pr-8 hp:pr-8`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      mm
                    </span>
                  </div>
                  <ErrorStyle
                    show={aoError.hDistance}
                    text={aoError.hDistance}
                  />
                </div>

                {/* Fix Angle Arm Object Input */}
                {armObject.type === "directional" && (
                  <div className="relative w-[140px] hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Fix Angle
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={armObject.fixAngle}
                        onChange={(e) =>
                          onUpdate(armObject.idAo, {
                            fixAngle: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(aoError.fixAngle)} pr-8 hp:pr-8`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                        deg
                      </span>
                    </div>
                    <ErrorStyle
                      show={aoError.fixAngle}
                      text={aoError.fixAngle}
                    />
                  </div>
                )}

                {/* nnC Arm Object Input */}
                <div className="relative w-[140px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    nnC
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={armObject.nnC}
                    onChange={(e) =>
                      onUpdate(armObject.idAo, { nnC: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={inputStyle(aoError.nnC)}
                  />
                  <ErrorStyle show={aoError.nnC} text={aoError.nnC} />
                </div>

                {/* Quantity Arm Object Input */}
                <div className="relative w-[100px] hp:w-full">
                  <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                    Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={armObject.quantity}
                      onChange={(e) =>
                        onUpdate(armObject.idAo, { quantity: e.target.value })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(aoError.quantity)} pr-6 hp:pr-6`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
                      pcs
                    </span>
                  </div>
                  <ErrorStyle show={aoError.quantity} text={aoError.quantity} />
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
          onClick={handleAddAo}
          disabled={armObjects.length >= 5}
          className={`
            w-full py-2.5 font-medium text-sm rounded-md sm:rounded-lg
            flex items-center justify-center gap-2
            transition-all duration-200

            ${
              armObjects.length >= 5
                ? "border-2 border-dashed border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                : "border-2 border-dashed border-[#3399cc] text-[#3399cc] bg-transparent hover:bg-[#3399cc] hover:text-white"
            }

            hp:text-xs hp:px-[22px]
          `}
        >
          <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
          Add Object
        </button>
      </div>
    </div>
  );
}
