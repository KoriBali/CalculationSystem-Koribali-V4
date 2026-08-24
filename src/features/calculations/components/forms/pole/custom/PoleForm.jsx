import { ChevronRight } from "lucide-react";
import { useMasterData } from "../../../../hooks/useMasterData";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Returns input className based on validation state
const inputStyle = (hasError) =>
  `w-full pl-3 md:pl-4 pr-8 py-2 lg:py-2.5 rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show && typeof text === "string" ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

// Reusable section card wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-lg sm:rounded-xl border border-gray-200">
    {children}
  </div>
);

// Reusable number input with unit suffix
const UnitInput = ({ value, onChange, unit, hasError, className, ...props }) => (
  <div className="relative">
    <input
      type="number"
      min={0}
      value={value}
      onChange={onChange}
      onWheel={(e) => e.target.blur()}
      className={className || inputStyle(hasError)}
      {...props}
    />
    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
      {unit}
    </span>
  </div>
);

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function PoleForm({ pole, onUpdate, errors }) {
  const isStraight = pole.type === "Straight";
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
          grid grid-cols-5 gap-x-3 gap-y-6
          xl:flex xl:flex-row xl:flex-nowrap xl:items-start xl:gap-x-2 2xl:gap-x-3
          hp:grid hp:grid-cols-2 hp:gap-3 hp:gap-y-6
        "
      >
        {/* Pole Name */}
        <div className="relative col-span-2 xl:flex-[2] min-w-0 hp:w-full hp:col-span-2">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Pole Name
          </label>
          <input
            id={`pole-${pole.idPole}-name`}
            type="text"
            value={pole.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., 支柱-1"
            className={`${inputStyle(errors.name)} px-3 2xl:px-4`}
          />
          <ErrorStyle show={errors.name} text={errors.name} />
        </div>

        {/* Material Type */}
        <div className="relative xl:w-[130px] xl:flex-none min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Material
          </label>
          <div className="relative">
            <select
                id={`pole-${pole.idPole}-material`}
              value={pole.material}
              onChange={(e) => onUpdate({ material: e.target.value })}
              disabled={materialsLoading || materialsFailed}
              className={`${inputStyle(errors.material || materialsFailed)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] pl-3 2xl:pl-4 pr-8 appearance-none`}
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
            <ErrorStyle show={errors.material} text={errors.material} />
          )}
        </div>

        {/* Pole Type */}
        <div className="relative xl:w-[130px] xl:flex-none min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Type
          </label>
          <div className="relative">
            <select
              id={`pole-${pole.idPole}-type`}
              value={pole.type}
              onChange={(e) => {
                const newType = e.target.value;
                if (newType === "Straight") {
                  onUpdate({
                    type: newType,
                    upperDiameter: pole.lowerDiameter,
                    upperThickness: pole.lowerThickness,
                  });
                } else {
                  onUpdate({ type: newType });
                }
              }}
              className={`${inputStyle(false)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] pl-3 2xl:pl-4 pr-8 appearance-none`}
            >
              <option value="Straight">Straight</option>
              <option value="Taper">Taper</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        {/* Diameter (Lower / Straight) */}
        <div className="relative xl:flex-[1.2] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            {isStraight ? "Diameter" : "Lower Diameter"}
          </label>
          <UnitInput
            id={`pole-${pole.idPole}-lowerDiameter`}
            value={pole.lowerDiameter}
            onChange={(e) =>
              onUpdate({
                lowerDiameter: e.target.value,
                ...(isStraight && { upperDiameter: e.target.value }),
              })
            }
            unit="mm"
            hasError={errors.lowerDiameter || (isStraight && errors.upperDiameter)}
            className={`${inputStyle(errors.lowerDiameter || (isStraight && errors.upperDiameter))} pl-3 2xl:pl-4 pr-7`}
          />
          <ErrorStyle
            show={errors.lowerDiameter || (isStraight && errors.upperDiameter)}
            text={errors.lowerDiameter || (isStraight && errors.upperDiameter)}
          />
        </div>

        {/* Upper Diameter (Taper only) */}
        {!isStraight && (
          <div className="relative xl:flex-[1.2] min-w-0 hp:w-full">
            <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
              Upper Diameter
            </label>
            <UnitInput
              id={`pole-${pole.idPole}-upperDiameter`}
              value={pole.upperDiameter}
              onChange={(e) => onUpdate({ upperDiameter: e.target.value })}
              unit="mm"
              hasError={errors.upperDiameter}
              className={`${inputStyle(errors.upperDiameter)} pl-3 2xl:pl-4 pr-7`}
            />
            <ErrorStyle show={errors.upperDiameter} text={errors.upperDiameter} />
          </div>
        )}

        {/* Thickness (Lower / Straight) */}
        <div className="relative xl:flex-[1.2] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            {isStraight ? "Thickness" : "Lower Thickness"}
          </label>
          <UnitInput
            id={`pole-${pole.idPole}-lowerThickness`}
            value={pole.lowerThickness}
            onChange={(e) =>
              onUpdate({
                lowerThickness: e.target.value,
                ...(isStraight && { upperThickness: e.target.value }),
              })
            }
            unit="mm"
            hasError={errors.lowerThickness || (isStraight && errors.upperThickness)}
            className={`${inputStyle(errors.lowerThickness || (isStraight && errors.upperThickness))} pl-3 2xl:pl-4 pr-7`}
          />
          <ErrorStyle
            show={errors.lowerThickness || (isStraight && errors.upperThickness)}
            text={errors.lowerThickness || (isStraight && errors.upperThickness)}
          />
        </div>

        {/* Upper Thickness (Taper only) */}
        {!isStraight && (
          <div className="relative xl:flex-[1.2] min-w-0 hp:w-full">
            <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
              Upper Thickness
            </label>
            <UnitInput
              id={`pole-${pole.idPole}-upperThickness`}
              value={pole.upperThickness}
              onChange={(e) => onUpdate({ upperThickness: e.target.value })}
              unit="mm"
              hasError={errors.upperThickness}
              className={`${inputStyle(errors.upperThickness)} pl-3 2xl:pl-4 pr-7`}
            />
            <ErrorStyle show={errors.upperThickness} text={errors.upperThickness} />
          </div>
        )}

        {/* Height */}
        <div className="relative xl:flex-[1.2] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Height (Z/H)
          </label>
          <UnitInput
            id={`pole-${pole.idPole}-zHeight`}
            value={pole.zHeight}
            onChange={(e) => onUpdate({ zHeight: e.target.value })}
            unit="mm"
            hasError={errors.zHeight}
            className={`${inputStyle(errors.zHeight)} pl-3 2xl:pl-4 pr-7`}
          />
          <ErrorStyle show={errors.zHeight} text={errors.zHeight} />
        </div>

        {/* Quantity */}
        <div className="relative xl:flex-[0.8] min-w-0 hp:w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Quantity
          </label>
          <UnitInput
            id={`pole-${pole.idPole}-quantity`}
            value={pole.quantity}
            onChange={(e) => onUpdate({ quantity: e.target.value })}
            unit="pcs"
            hasError={errors.quantity}
            min="1"
            placeholder="1"
            className={`${inputStyle(errors.quantity)} pl-3 2xl:pl-4 pr-7`}
          />
          <ErrorStyle show={errors.quantity} text={errors.quantity} />
        </div>
      </div>
    </div>
  );
}
