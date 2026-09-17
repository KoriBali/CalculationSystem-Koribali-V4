import { Box } from "lucide-react";
import { RoundCaissonTypeForm } from "../foundation/RoundCaissonTypeForm";
import { SquareCaissonTypeForm } from "../foundation/SquareCaissonTypeForm";
import { FormSelect } from "../../../../../shared/components/FormSelect";

const FOUNDATION_TYPE_OPTIONS = [
  { value: "square-caisson", label: "Square Caisson Type" },
  { value: "round-caisson", label: "Round Caisson Type" },
];

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-3 md:-bottom-4 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

export function DrawingFoundationForm({
  foundationType,
  squareCaisson,
  roundCaisson,
  onFoundationTypeUpdate,
  onSquareCaissonUpdate,
  onRoundCaissonUpdate,
  errors,
  onNext,
  onBack,
  buttonLabel = "Save & Continue",
}) {
  return (
    <div className="bg-white rounded-2xl hp:rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(15,23,42,0.06)] overflow-hidden">
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]" />
      <div className="flex flex-col h-full p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <SectionTitle>Foundation Type</SectionTitle>
          <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
            <div className="relative pb-1">
              <FormSelect
                id="foundationType"
                value={foundationType.type || ""}
                onChange={(val) => onFoundationTypeUpdate({ type: val })}
                options={FOUNDATION_TYPE_OPTIONS}
                hasError={!!errors.foundationType?.type}
                placeholder="Select Foundation Type"
              />
              <ErrorStyle show={errors.foundationType?.type} text={errors.foundationType?.type} />
            </div>
          </div>
        </div>

        <div>
          <SectionTitle>Foundation Specifications</SectionTitle>

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
              buttonLabel={buttonLabel}
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
              buttonLabel={buttonLabel}
              isDrawingMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
