import { RotateCcw, ChevronRight } from "lucide-react";
import { ProjectIdentityFields } from "./ProjectIdentityFields";
import { WorkflowModePicker } from "./WorkflowModePicker";

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
  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        <div className="space-y-6 md:space-y-8">
          <ProjectIdentityFields
            identityData={identityData}
            onUpdate={onUpdateIdentity}
            errors={identityErrors}
          />

          <WorkflowModePicker projectMode={projectMode} onSelectMode={onSelectMode} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          {/* Reset => clears identity fields + document type back to default */}
          <button
            onClick={onReset}
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
            {projectMode === "drawing"
              ? "Go to Drawing"
              : projectMode === "calculation"
              ? "Go to Calculation"
              : "Next Step"}
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
