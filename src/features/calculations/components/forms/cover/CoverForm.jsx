import { RotateCcw, ChevronRight, PenTool, LayoutDashboard, Blocks, CheckCircle, Circle } from "lucide-react";

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

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

// Reusable section card wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
    {children}
  </div>
);

/**
 * Constants
 */
// Default empty state used when resetting the form
const EMPTY_COVER = {
  managementCode: "",
  calculationNumber: "",
  projectName: "",
  coverTopText: "",
  coverBottomText: "",
  date: "",
  projectMode: "calculation",
  withReport: false,
};

// Shared className for optional (non-validated) inputs
const optionalInputStyle =
  "w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md border border-gray-300 focus:ring-1 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white text-xs md:text-sm";

/**
 * MAIN COMPONENT: CoverForm
 */
export function CoverForm({ coverData, onUpdate, onFinish, errors }) {
  // Resets all fields back to empty
  const handleReset = () => onUpdate(EMPTY_COVER);

  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        <div className="space-y-6 md:space-y-8">
          <div>
            <SectionTitle>Project Information</SectionTitle>
            <SectionCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 md:gap-y-8">
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
                    className={`${inputStyle(errors.managementCode)} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
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
                    className={`${inputStyle(errors.calculationNumber)} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                  />
                  <ErrorStyle
                    show={errors.calculationNumber}
                    text={errors.calculationNumber}
                  />
                </div>

                {/* Line 1 (Project Name) - required */}
                <div className="relative">
                  <Label>Project Name</Label>
                  <input
                    type="text"
                    value={coverData.projectName}
                    onChange={(e) => onUpdate({ projectName: e.target.value })}
                    className={`${inputStyle(errors.projectName)} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                  />
                  <ErrorStyle show={errors.projectName} text={errors.projectName} />
                </div>

                {/* Line 2 - optional (Hidden temporarily) */}
                <div className="md:col-span-2 hidden">
                  <Label>Line 2 (Optional)</Label>
                  <input
                    type="text"
                    value={coverData.coverTopText}
                    onChange={(e) => onUpdate({ coverTopText: e.target.value })}
                    className={`${optionalInputStyle} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                  />
                </div>

                {/* Line 3 - optional (Hidden temporarily) */}
                <div className="md:col-span-2 hidden">
                  <Label>Line 3 (Optional)</Label>
                  <input
                    type="text"
                    value={coverData.coverBottomText}
                    onChange={(e) => onUpdate({ coverBottomText: e.target.value })}
                    className={`${optionalInputStyle} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                  />
                </div>

                {/* Document Date - required */}
                <div className="relative">
                  <Label>Document Date</Label>
                  <input
                    type="date"
                    value={coverData.date}
                    onChange={(e) => onUpdate({ date: e.target.value })}
                    className={`${inputStyle(errors.date)} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
                  />
                  <ErrorStyle show={errors.date} text={errors.date} />
                </div>

              </div>
            </SectionCard>
          </div>

          {/* New Section for Document Options */}
          <div>
            <SectionTitle>Project Mode</SectionTitle>
            <SectionCard>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RadioCard
                  label="Calculation Only"
                  icon={<LayoutDashboard size={16} />}
                  selected={coverData.projectMode === "calculation"}
                  onSelect={() => onUpdate({ projectMode: "calculation" })}
                />
                <RadioCard
                  label="Drawing Only"
                  icon={<PenTool size={16} />}
                  selected={coverData.projectMode === "drawing"}
                  onSelect={() => onUpdate({ projectMode: "drawing" })}
                />
                <RadioCard
                  label="Calculation & Drawing"
                  icon={<Blocks size={16} />}
                  selected={coverData.projectMode === "both"}
                  onSelect={() => onUpdate({ projectMode: "both" })}
                />
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          {/* Reset => clears all fields */}
          <button
            onClick={handleReset}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
            rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm 
            ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>

          {/* Submit - triggers next step */}
          <button
            onClick={onFinish}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
          >
            {coverData.projectMode === "drawing"
              ? "Go to Drawing"
              : coverData.projectMode === "calculation"
              ? "Go to Calculation"
              : "Next Step"}
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

// Reusable radio card for mutually exclusive selections
function RadioCard({ label, icon, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left relative overflow-hidden rounded-lg hp:rounded-md border-2 p-3 md:p-5 transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
            : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`p-2 rounded-lg hp:rounded-md transition-colors ${selected ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-600"}`}
          >
            {icon}
          </div>
          {/* Label */}
          <p
            className={`text-[12px] md:text-sm font-medium ${selected ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}
          >
            {label}
          </p>
        </div>

        {/* Radio Indicator */}
        <div className="shrink-0 ml-2">
          {selected ? (
            <CheckCircle className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
        </div>
      </div>
    </button>
  );
}
