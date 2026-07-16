import { useProjectStorage } from "./useProjectStorage";
import { computeInitialWorkflow } from "../utils/coverMigration";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DEFAULT_WORKFLOW = {
  projectMode: "calculation",
  withReport: false,
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages workflow flags — projectMode (calculation/drawing/both) picked on
// the Project Setup page, and withReport toggled on the Initial Input page.
// No yup validation needed — both fields have safe defaults.
export function useWorkflowMode(projectType) {
  const [workflow, setWorkflow] = useProjectStorage(
    projectType,
    "workflow",
    computeInitialWorkflow(projectType, DEFAULT_WORKFLOW),
  );

  const updateWorkflow = (updates) =>
    setWorkflow((prev) => ({ ...prev, ...updates }));

  const resetMode = () =>
    updateWorkflow({ projectMode: DEFAULT_WORKFLOW.projectMode });

  return {
    workflowData: workflow,
    updateWorkflow,
    resetMode,
  };
}
