import { RotateCcw, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProjectIdentityFields } from "./ProjectIdentityFields";
import { WorkflowModePicker } from "./WorkflowModePicker";
import { ConfirmResetAllModal } from "../../modals/ConfirmResetAllModal";

/**
 * MAIN COMPONENT: CoverForm
 *
 * Composing shell for the "Project Setup" page — combines the Project
 * Identity fields and the Document Type (workflow mode) picker, which are
 * backed by two independent hooks/sessionStorage keys (useProjectIdentityForm,
 * useWorkflowMode) even though they render together on the same page.
 */
export function CoverForm({
  identityData,
  identityErrors,
  onUpdateIdentity,
  projectMode,
  onSelectMode,
  onReset,
  onFinish,
}) {
  // State for reset confirmation modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Determine the next page based on the selected document type.
  // Drawing Only        -> Drawing Setup
  // Calculation Only    -> Calculation Condition
  // Calculation & Drawing -> Calculation Condition
  const nextStepLabel =
    projectMode === "drawing"
      ? "Next: Drawing Setup"
      : "Next: Calculation Condition";

  return (
    <div className="relative">
      <div
        className="
          bg-white
          rounded-2xl hp:rounded-xl
          border border-gray-200
          shadow-[0_2px_10px_rgba(15,23,42,0.06)]
          overflow-hidden
        "
      >
        {/* Top accent strip — full-bleed rect, otomatis ke-clip mengikuti rounded corner parent */}
        <div
          aria-hidden="true"
          className="
            h-1.5
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
          "
        />

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Project setup content */}
          <div className="space-y-6 md:space-y-8">
            <ProjectIdentityFields
              identityData={identityData}
              onUpdate={onUpdateIdentity}
              errors={identityErrors}
            />

            <WorkflowModePicker
              projectMode={projectMode}
              onSelectMode={onSelectMode}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Footer actions */}
          <div className="flex justify-between items-center pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="
              flex justify-center items-center gap-2
              px-5 py-2.5
              hp:px-3 hp:py-2
              md:px-6
              rounded-lg hp:rounded-md
              font-medium
              bg-white
              hover:bg-red-50
              text-red-400
              text-xs sm:text-sm
              border border-red-300
              hover:border-red-400
              shadow-sm
              transition-colors
            "
            >
              <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
              <span className="hp:hidden">Reset</span>
            </button>

            <button
              type="button"
              onClick={onFinish}
              className="
              flex justify-center items-center gap-2
              px-5 py-2.5
              md:px-6
              rounded-lg hp:rounded-md
              font-medium
              bg-gradient-to-r
              from-[#0d3b66]
              to-[#3399cc]
              text-white
              text-xs md:text-sm
              hover:brightness-110
              shadow-sm
              transition-all
            "
            >
              <span>{nextStepLabel}</span>
              <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={onReset}
      />
    </div>
  );
}
