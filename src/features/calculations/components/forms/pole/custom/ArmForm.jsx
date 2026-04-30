/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm outline-none transition-all border pr-14
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

/**
 * MAIN COMPONENT
 */
export function ArmInput({ arm, onUpdate, armError }) {
  return (
    <div>
      <div
        className="
          grid
          grid-cols-12
          gap-2
          xl:grid-cols-12
          lg:grid-cols-4
          md:grid-cols-3
          sm:grid-cols-2
          grid-cols-1
        "
      >
        {/* Arm Name Input */}
        <div className="relative col-span-2">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Arm Name
          </label>
          <input
            type="text"
            value={arm.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., 感知器アーム"
            className={inputStyle(armError.name)}
          />
          <ErrorStyle show={armError.name} text={armError.name} />
        </div>

        {/* Material Arm Selector */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Material
          </label>
          <select
            value={arm.material}
            onChange={(e) => onUpdate({ material: e.target.value })}
            className={`
              ${inputStyle(armError.material)}
              pr-4
              h-[42px]
            `}
          >
            <option value="STK400">STK400</option>
            <option value="STK490">STK490</option>
            <option value="STK500">STK500</option>
            <option value="STK540">STK540</option>
            <option value="STKR400">STKR400</option>
          </select>
          <ErrorStyle show={armError.material} text={armError.material} />
        </div>

        {/* Diameter Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Diameter
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.diameter}
              onChange={(e) =>
                onUpdate({
                  diameter: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.diameter)} pr-7 hp:py-[9.5px] hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.diameter} text={armError.diameter} />
        </div>

        {/* Thickness Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Thickness
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.thickness}
              onChange={(e) =>
                onUpdate({
                  thickness: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.thickness)} pr-7 hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.thickness} text={armError.thickness} />
        </div>

        {/* Length Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Length
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.length}
              onChange={(e) =>
                onUpdate({
                  length: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.length)} pr-7 hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.length} text={armError.length} />
        </div>

        {/* Exp.Length Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            exp.Length
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.expLength}
              onChange={(e) =>
                onUpdate({
                  expLength: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.expLength)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.expLength} text={armError.expLength} />
        </div>

        {/* Height Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Z (H)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.zHeight}
              onChange={(e) =>
                onUpdate({
                  zHeight: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.zHeight)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.zHeight} text={armError.zHeight} />
        </div>

        {/* H-Distance Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            H-Distance
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.hDistance}
              onChange={(e) =>
                onUpdate({
                  hDistance: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.hDistance)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.hDistance} text={armError.hDistance} />
        </div>

        {/* Fix Angle Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Fix Angle
          </label>
          <div className="relative">
            <input
              type="number"
              value={arm.fixAngle}
              onChange={(e) =>
                onUpdate({
                  fixAngle: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.fixAngle)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              deg
            </span>
          </div>
          <ErrorStyle show={armError.fixAngle} text={armError.fixAngle} />
        </div>

        {/* nnC Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            nnC
          </label>
          <input
            type="number"
            min={0}
            value={arm.nnC}
            onChange={(e) =>
              onUpdate({
                nnC: e.target.value,
              })
            }
            onWheel={(e) => e.target.blur()}
            className={`${inputStyle(armError.nnC)}`}
          />
          <ErrorStyle show={armError.nnC} text={armError.nnC} />
        </div>

        {/* Quantity Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.quantity}
              onChange={(e) =>
                onUpdate({
                  quantity: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.quantity)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              pcs
            </span>
          </div>
          <ErrorStyle show={armError.quantity} text={armError.quantity} />
        </div>
      </div>
    </div>
  );
}
