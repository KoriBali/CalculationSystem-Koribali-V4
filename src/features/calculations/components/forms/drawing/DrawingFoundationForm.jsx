import { Box, ChevronDown, RotateCcw } from "lucide-react";
import { RoundCaissonTypeForm } from "../foundation/RoundCaissonTypeForm";
import { SquareCaissonTypeForm } from "../foundation/SquareCaissonTypeForm";

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-3 md:-bottom-4 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

export function DrawingFoundationForm({
  foundationType,
  squareCaisson,
  roundCaisson,
  onFoundationTypeUpdate,
  onSquareCaissonUpdate,
  onRoundCaissonUpdate,
  onReset,
  errors,
  onNext,
  onBack,
}) {
  return (
    <div className="flex flex-col h-full bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
        <div className="relative pb-1">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label className="block text-xs md:text-sm text-gray-700">Foundation Type</label>
            <button
              onClick={onReset}
              title="Reset form"
              className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="relative">
            <select
              id="foundationType"
              value={foundationType.type || ""}
              onChange={(e) => onFoundationTypeUpdate({ type: e.target.value })}
              className={`${inputStyle(errors.foundationType?.type)} min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] cursor-pointer appearance-none`}
            >
              <option value="" disabled>Select Foundation Type</option>
              <option value="square-caisson">Square Caisson Type</option>
              <option value="round-caisson">Round Caisson Type</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <ErrorStyle show={errors.foundationType?.type} text={errors.foundationType?.type} />
        </div>
      </div>

      {!foundationType.type && (
        <div className="bg-white border border-gray-200 rounded-xl hp:rounded-lg p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Box className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Please select foundation type first
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Choose the type above to configure parameters
          </p>
        </div>
      )}

      {foundationType.type === "square-caisson" && (
        <SquareCaissonTypeForm
          squareCaisson={squareCaisson}
          onUpdate={onSquareCaissonUpdate}
          errors={errors.squareCaisson || {}}
          onNext={onNext}
          onBack={onBack}
          isCalculated={true} 
          buttonLabel="Save & Continue"
          isDrawingMode={true}
        />
      )}

      {foundationType.type === "round-caisson" && (
        <RoundCaissonTypeForm
          roundCaisson={roundCaisson}
          onUpdate={onRoundCaissonUpdate}
          errors={errors.roundCaisson || {}}
          onNext={onNext}
          onBack={onBack}
          isCalculated={true} 
          buttonLabel="Save & Continue"
          isDrawingMode={true}
        />
      )}
    </div>
  );
}
