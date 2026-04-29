import { RotateCcw, ChevronRight } from "lucide-react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */
// Dynamic styling for input fields based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border
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

// Reusable label with consistent styling
const Label = ({ children }) => (
  <label className="block text-gray-700 mb-1 md:mb-2 text-xs md:text-sm font-medium">
    {children}
  </label>
);

/**
 * Constants
 */
// Default empty state used when resetting the form
const EMPTY_COVER = {
  managementCode: "",
  calculationNumber: "",
  line1: "",
  line2: "",
  line3: "",
  date: "",
};

// Shared className for optional (non-validated) inputs
const optionalInputStyle =
  "w-full text-xs px-2 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-md md:rounded-lg focus:ring-1 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white";

/**
 * MAIN COMPONENT: CoverForm
 */
export function CoverForm({ coverData, onUpdate, onMake, errors }) {
  // Resets all fields back to empty
  const handleReset = () => onUpdate(EMPTY_COVER);

  return (
    <div>
      <div className="bg-white border border-gray-200 p-4 md:p-5 rounded-b-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 md:gap-y-7">
          {/* Management Code - auto-formatted as "A ー B ー C" */}
          <div className="relative">
            <Label>Management Code</Label>
            <input
              type="text"
              value={coverData.managementCode}
              onChange={(e) => {
                const raw = e.target.value.toUpperCase().replace(/[^A-Z]/g, ""); // letters only
                const letters = raw.slice(0, 3); // max 3 chars
                const formatted = letters.split("").join(" ー "); // A ー B ー C
                onUpdate({ managementCode: formatted });
              }}
              className={inputStyle(errors.managementCode)}
            />
            <ErrorStyle
              show={errors.managementCode}
              text={errors.managementCode}
            />
          </div>

          {/* Calculation Document Number */}
          <div className="relative">
            <Label>Calculation Document Number</Label>
            <input
              type="text"
              value={coverData.calculationNumber}
              onChange={(e) => onUpdate({ calculationNumber: e.target.value })}
              className={inputStyle(errors.calculationNumber)}
            />
            <ErrorStyle
              show={errors.calculationNumber}
              text={errors.calculationNumber}
            />
          </div>

          {/* Line 1 - required */}
          <div className="relative md:col-span-2">
            <Label>Line 1</Label>
            <input
              type="text"
              value={coverData.line1}
              onChange={(e) => onUpdate({ line1: e.target.value })}
              className={inputStyle(errors.line1)}
            />
            <ErrorStyle show={errors.line1} text={errors.line1} />
          </div>

          {/* Line 2 - optional */}
          <div className="md:col-span-2">
            <Label>Line 2 (Optional)</Label>
            <input
              type="text"
              value={coverData.line2}
              onChange={(e) => onUpdate({ line2: e.target.value })}
              className={optionalInputStyle}
            />
          </div>

          {/* Line 3 - optional */}
          <div className="md:col-span-2">
            <Label>Line 3 (Optional)</Label>
            <input
              type="text"
              value={coverData.line3}
              onChange={(e) => onUpdate({ line3: e.target.value })}
              className={optionalInputStyle}
            />
          </div>

          {/* Document Date - required */}
          <div className="relative md:col-span-2">
            <Label>Document Date</Label>
            <input
              type="date"
              value={coverData.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className={inputStyle(errors.date)}
            />
            <ErrorStyle show={errors.date} text={errors.date} />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 md:mt-8 border-t border-gray-200" />

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 md:pt-6">
          {/* Reset - clears all fields */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-[20px] md:px-7 py-[10px] md:py-2.5 h-[40px] md:h-[45px]
            bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg
            hover:bg-[#e2e8f0] transition-colors font-medium text-xs"
          >
            <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
            Reset
          </button>

          {/* Submit - triggers report generation */}
          <button
            onClick={onMake}
            className="flex items-center gap-2 px-[20px] md:px-7 py-[10px] md:py-2.5 h-[40px] md:h-[45px]
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg
            hover:brightness-110 transition-all shadow-sm font-medium text-xs"
          >
            Make Report
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
