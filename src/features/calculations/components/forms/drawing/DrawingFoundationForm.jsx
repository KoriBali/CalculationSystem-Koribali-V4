import { Box } from "lucide-react";
import { FoundationType } from "../foundation/FoundationType";
import { RoundCaissonTypeForm } from "../foundation/RoundCaissonTypeForm";
import { SquareCaissonTypeForm } from "../foundation/SquareCaissonTypeForm";

export function DrawingFoundationForm({
  foundationType,
  squareCaisson,
  roundCaisson,
  onFoundationTypeUpdate,
  onSquareCaissonUpdate,
  onRoundCaissonUpdate,
  errors,
  onNext,
}) {
  return (
    <div className="flex flex-col h-full bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
        <FoundationType
          foundationType={foundationType}
          onUpdate={onFoundationTypeUpdate}
          errors={errors.foundationType || {}}
        />
      </div>

      <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
        {!foundationType.type && (
          <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
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
            isCalculated={true} 
            buttonLabel="Save & Continue"
            isDrawingMode={true}
          />
        )}
      </div>
    </div>
  );
}
