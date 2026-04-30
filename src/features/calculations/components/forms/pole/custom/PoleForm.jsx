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

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

// Reusable section card wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-lg md:rounded-xl border border-gray-200">
    {children}
  </div>
);

// Reusable number input with unit suffix
const UnitInput = ({ value, onChange, unit, hasError, ...props }) => (
  <div className="relative">
    <input
      type="number"
      min={0}
      value={value}
      onChange={onChange}
      onWheel={(e) => e.target.blur()}
      className={inputStyle(hasError)}
      {...props}
    />
    <span className="absolute right-4 text-xs md:text-sm top-1/2 -translate-y-1/2 text-gray-400">
      {unit}
    </span>
  </div>
);

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function PoleForm({
  pole, // object — current pole field values
  onUpdate, // fn — called on any field change
  errors, // object — validation errors per field
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* ── Basic Information ── */}
      <div>
        <SectionTitle>Basic Information</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
            {/* Pole Name */}
            <div className="relative">
              <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                Pole Name
              </label>
              <input
                type="text"
                value={pole.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="e.g., 支柱-1"
                className={inputStyle(errors.name)}
              />
              <ErrorStyle show={errors.name} text={errors.name} />
            </div>

            {/* Material Type */}
            <div className="relative">
              <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                Material Type
              </label>
              <select
                value={pole.material}
                onChange={(e) => onUpdate({ material: e.target.value })}
                className={`${inputStyle(errors.material)} min-h-[42px]`}
              >
                <option value="STK400">STK400</option>
                <option value="STK490">STK490</option>
                <option value="STK500">STK500</option>
                <option value="STK540">STK540</option>
                <option value="STKR400">STKR400</option>
              </select>
              <ErrorStyle show={errors.material} text={errors.material} />
            </div>

            {/* Pole Type — determines which dimension fields are shown */}
            <div>
              <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                Pole Type
              </label>
              <select
                value={pole.type}
                onChange={(e) => onUpdate({ type: e.target.value })}
                className="w-full min-h-[42px] px-2 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-md md:rounded-lg text-xs md:text-sm
                focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
              >
                <option value="Straight">Straight</option>
                <option value="Taper">Taper</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Dimensions & Specifications ── */}
      <div>
        <SectionTitle>Dimensions & Specifications</SectionTitle>
        <SectionCard>
          {/* Straight — single diameter & thickness */}
          {pole.type === "Straight" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Diameter */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Diameter Pole
                </label>
                <UnitInput
                  value={pole.lowerDiameter}
                  onChange={(e) =>
                    onUpdate({
                      lowerDiameter: e.target.value,
                      upperDiameter: e.target.value, // Straight = same top & bottom
                    })
                  }
                  unit="mm"
                  hasError={errors.lowerDiameter}
                />
                <ErrorStyle
                  show={errors.lowerDiameter}
                  text={errors.lowerDiameter}
                />
              </div>

              {/* Thickness */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Thickness Pole
                </label>
                <UnitInput
                  value={pole.lowerThickness}
                  onChange={(e) =>
                    onUpdate({
                      lowerThickness: e.target.value,
                      upperThickness: e.target.value, // Straight = same top & bottom
                    })
                  }
                  unit="mm"
                  hasError={errors.lowerThickness}
                />
                <ErrorStyle
                  show={errors.lowerThickness}
                  text={errors.lowerThickness}
                />
              </div>
            </div>
          ) : (
            /* Taper — separate lower & upper for diameter and thickness */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Lower Diameter */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Lower Diameter
                </label>
                <UnitInput
                  value={pole.lowerDiameter}
                  onChange={(e) => onUpdate({ lowerDiameter: e.target.value })}
                  unit="mm"
                  hasError={errors.lowerDiameter}
                />
                <ErrorStyle
                  show={errors.lowerDiameter}
                  text={errors.lowerDiameter}
                />
              </div>

              {/* Upper Diameter */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Upper Diameter
                </label>
                <UnitInput
                  value={pole.upperDiameter}
                  onChange={(e) => onUpdate({ upperDiameter: e.target.value })}
                  unit="mm"
                  hasError={errors.upperDiameter}
                />
                <ErrorStyle
                  show={errors.upperDiameter}
                  text={errors.upperDiameter}
                />
              </div>

              {/* Lower Thickness */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Lower Thickness
                </label>
                <UnitInput
                  value={pole.lowerThickness}
                  onChange={(e) => onUpdate({ lowerThickness: e.target.value })}
                  unit="mm"
                  hasError={errors.lowerThickness}
                />
                <ErrorStyle
                  show={errors.lowerThickness}
                  text={errors.lowerThickness}
                />
              </div>

              {/* Upper Thickness */}
              <div className="relative">
                <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                  Upper Thickness
                </label>
                <UnitInput
                  value={pole.upperThickness}
                  onChange={(e) => onUpdate({ upperThickness: e.target.value })}
                  unit="mm"
                  hasError={errors.upperThickness}
                />
                <ErrorStyle
                  show={errors.upperThickness}
                  text={errors.upperThickness}
                />
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Additional Parameters ── */}
      <div>
        <SectionTitle>Additional Parameters</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
            {/* Height */}
            <div className="relative">
              <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                Height (Z/H)
              </label>
              <UnitInput
                value={pole.height}
                onChange={(e) => onUpdate({ height: e.target.value })}
                unit="mm"
                hasError={errors.height}
              />
              <ErrorStyle show={errors.height} text={errors.height} />
            </div>

            {/* Quantity */}
            <div className="relative">
              <label className="block text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
                Quantity
              </label>
              <UnitInput
                value={pole.quantity}
                onChange={(e) => onUpdate({ quantity: e.target.value })}
                unit="pcs"
                hasError={errors.quantity}
                min="1"
                placeholder="1"
              />
              <ErrorStyle show={errors.quantity} text={errors.quantity} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
