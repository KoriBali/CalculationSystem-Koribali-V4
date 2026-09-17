import { ChevronLeft, ChevronRight, RotateCcw, Box } from "lucide-react";
import { useState } from "react";
import { ConfirmResetAllModal } from "../../modals/ConfirmResetAllModal";
import { FieldErrorHint } from "../../../../../shared/components/FieldErrorHint";
import { FormSelect } from "../../../../../shared/components/FormSelect";

const OPENING_TYPE_OPTIONS = [
  { value: "box", label: "Box Type" },
  { value: "r", label: "R Type" },
];

const OPENING_DIRECTION_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "front", label: "Front" },
  { value: "right", label: "Right" },
  { value: "back", label: "Back" },
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

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export function DrawingOpeningForm({
  opening,
  onUpdate,
  onReset,
  onBack,
  onNext,
  errors,
  nextLabel = "Save & Continue",
}) {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl hp:rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(15,23,42,0.06)] overflow-hidden">
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]" />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* ── Opening Type Selection ── */}
        <div>
          <SectionTitle>Opening Type</SectionTitle>
          <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
            <div className="relative">
              <FormSelect
                id="type"
                value={opening.type || ""}
                onChange={(val) => onUpdate({ type: val })}
                options={OPENING_TYPE_OPTIONS}
                hasError={!!errors.type}
                placeholder="Select Opening Type"
              />
              <ErrorStyle show={errors.type} text={errors.type} />
            </div>
          </div>
        </div>

        {/* ── Visual Editor (Side View Only) ── */}
        <div>
          <SectionTitle>Opening Specifications</SectionTitle>
          {opening.type ? (
            <div className="bg-white px-4 md:px-5 py-8 md:py-12 rounded-xl hp:rounded-lg border border-gray-200 flex justify-center">
              <div className="flex flex-row gap-1 sm:ml-[21px] 2xl:ml-0 justify-center items-center px-2 md:px-6">
                {/* Left Side: Opening Direction */}
                <div className="relative mb-[10px] sm:mb-[20px] w-[120px] sm:w-[150px] xl:w-[150px]">
                  <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium whitespace-nowrap">
                    Opening Direction
                  </label>
                  <div className="relative">
                    <FormSelect
                      id="direction"
                      value={opening.direction || ""}
                      onChange={(val) => onUpdate({ direction: val })}
                      options={OPENING_DIRECTION_OPTIONS}
                      hasError={!!errors.direction}
                      placeholder="Select Direction"
                    />
                    <FieldErrorHint message={errors.direction} />
                  </div>
                </div>

                {/* Middle: Side View Diagram */}
                <div className="flex items-center justify-center">
                  <img
                    src={
                      opening.type === "box"
                        ? "/images/op-side-view-v2.svg"
                        : "/images/RType-SideView (1).svg"
                    }
                    alt="Side View"
                    className="h-[200px] sm:h-[320px] 2xl:h-[350px] object-contain"
                  />
                </div>

                {/* Right Side: Opening Length (Height) */}
                <div className="relative mt-[80px] sm:mt-[150px] w-[100px] sm:w-[120px] xl:w-[140px]">
                  <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2 font-medium whitespace-nowrap">
                    Opening Length
                  </label>
                  <div className="relative">
                    <input
                      id="height"
                      type="number"
                      min={0}
                      value={opening.height || ""}
                      onChange={(e) => onUpdate({ height: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(errors.height)} pr-6 sm:pr-9 xl:pr-9 w-full`}
                    />
                    <span className="absolute right-2 sm:right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                      mm
                    </span>
                    <FieldErrorHint message={errors.height} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                Please select opening type first
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Choose the type above to configure parameters
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-6" />

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          <button
            onClick={onBack}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
            rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm
            ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-red-500 font-medium text-xs md:text-sm hover:bg-red-50 hover:text-red-600 transition-colors border border-red-300"
            >
              <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
              Reset
            </button>

            <button
              onClick={onNext}
              className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
              rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
            >
              {nextLabel}
              <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={onReset}
        title="Reset all inputs on this section?"
        description="This will clear all inputs entered in this section. This action cannot be undone."
      />
    </div>
  );
}
