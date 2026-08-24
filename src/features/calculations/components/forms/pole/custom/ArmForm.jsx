import { ChevronRight } from "lucide-react";
import { useMasterData } from "../../../../hooks/useMasterData";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `w-full py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
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
export function ArmForm({ arm, onUpdate, armError }) {
  const {
    materialOptions,
    loading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials,
  } = useMasterData();
  const materialsFailed = materialsError && materialOptions.length === 0 && !materialsLoading;

  return (
    <div>
      <div
        className="
          grid grid-cols-6 gap-x-2 gap-y-6
          2xl:flex 2xl:flex-row 2xl:flex-nowrap 2xl:items-start 2xl:gap-x-3
          hp:grid hp:grid-cols-2 hp:gap-3 hp:gap-y-6 pb-2
        "
      >
        {/* Arm Name Input */}
        <div className="relative col-span-2 2xl:flex-[2] min-w-0 hp:w-full hp:col-span-2">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Arm Name
          </label>
          <input
            id={`arm-${arm.idArm}-name`}
            type="text"
            value={arm.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., 感知器アーム"
            className={`${inputStyle(armError.name)} px-3 2xl:px-4`}
          />
          <ErrorStyle show={armError.name} text={armError.name} />
        </div>

        {/* Material Arm Selector */}
        <div className="relative 2xl:w-[120px] 2xl:flex-none min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Material
          </label>
          <div className="relative">
            <select
              id={`arm-${arm.idArm}-material`}
              value={arm.material}
              onChange={(e) => onUpdate({ material: e.target.value })}
              disabled={materialsLoading || materialsFailed}
              className={`
                ${inputStyle(armError.material || materialsFailed)}
                min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] pl-3 2xl:pl-4 pr-8 appearance-none`}
            >
              {materialsLoading ? (
                <option value="">Loading...</option>
              ) : materialsFailed ? (
                <option value="">Failed to load</option>
              ) : (
                materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
          {materialsFailed ? (
            <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
              <span>Failed to load.</span>
              <button
                type="button"
                onClick={refetchMaterials}
                className="underline hover:text-red-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <ErrorStyle show={armError.material} text={armError.material} />
          )}
        </div>

        {/* Diameter Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Diameter
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-diameter`}
              type="number"
              min={0}
              value={arm.diameter}
              onChange={(e) =>
                onUpdate({
                  diameter: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.diameter)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.diameter} text={armError.diameter} />
        </div>

        {/* Thickness Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Thickness
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-thickness`}
              type="number"
              min={0}
              value={arm.thickness}
              onChange={(e) =>
                onUpdate({
                  thickness: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.thickness)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.thickness} text={armError.thickness} />
        </div>

        {/* Length Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Length
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-length`}
              type="number"
              min={0}
              value={arm.length}
              onChange={(e) =>
                onUpdate({
                  length: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.length)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.length} text={armError.length} />
        </div>

        {/* Exp.Length Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            exp.Length
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-expLength`}
              type="number"
              min={0}
              value={arm.expLength}
              onChange={(e) =>
                onUpdate({
                  expLength: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.expLength)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.expLength} text={armError.expLength} />
        </div>

        {/* Height Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Z (Height)
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-zHeight`}
              type="number"
              min={0}
              value={arm.zHeight}
              onChange={(e) =>
                onUpdate({
                  zHeight: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.zHeight)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.zHeight} text={armError.zHeight} />
        </div>

        {/* H-Distance Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            H-Distance
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-hDistance`}
              type="number"
              min={0}
              value={arm.hDistance}
              onChange={(e) =>
                onUpdate({
                  hDistance: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.hDistance)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>
          <ErrorStyle show={armError.hDistance} text={armError.hDistance} />
        </div>

        {/* Fix Angle Arm Input */}
        <div className="relative 2xl:flex-1 min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Fix Angle
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-fixAngle`}
              type="number"
              value={arm.fixAngle}
              onChange={(e) =>
                onUpdate({
                  fixAngle: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.fixAngle)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              deg
            </span>
          </div>
          <ErrorStyle show={armError.fixAngle} text={armError.fixAngle} />
        </div>

        {/* nnC Arm Input */}
        <div className="relative 2xl:flex-[0.8] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            nnC
          </label>
          <input
            id={`arm-${arm.idArm}-nnC`}
            type="number"
            min={0}
            value={arm.nnC}
            onChange={(e) =>
              onUpdate({
                nnC: e.target.value,
              })
            }
            onWheel={(e) => e.target.blur()}
            className={`${inputStyle(armError.nnC)} px-3 2xl:px-4`}
          />
          <ErrorStyle show={armError.nnC} text={armError.nnC} />
        </div>

        {/* Quantity Arm Input */}
        <div className="relative 2xl:flex-[0.8] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Quantity
          </label>
          <div className="relative">
            <input
              id={`arm-${arm.idArm}-quantity`}
              type="number"
              min={0}
              value={arm.quantity}
              onChange={(e) =>
                onUpdate({
                  quantity: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputStyle(armError.quantity)} pl-3 2xl:pl-4 pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
              pcs
            </span>
          </div>
          <ErrorStyle show={armError.quantity} text={armError.quantity} />
        </div>
      </div>
    </div>
  );
}
