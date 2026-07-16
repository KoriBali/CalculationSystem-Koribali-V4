import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import { validateWithYup } from "../utils";
import { ProjectSetupSchema } from "../schemas/cover/ProjectSetupSchema";
import { computeInitialIdentity } from "../utils/coverMigration";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DEFAULT_IDENTITY = {
  requestNo: "",
  companyName: "",
  requestType: "New",
  projectNo: "",
  requestedDueDate: "",
  projectName: "",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages project identity fields (Request No, Company Name, etc.) — shown
// on the Project Setup page, independent of workflow mode and report cover.
export function useProjectIdentityForm(projectType) {
  const [identity, setIdentity] = useProjectStorage(
    projectType,
    "projectIdentity",
    computeInitialIdentity(projectType, DEFAULT_IDENTITY),
  );
  const [identityErrors, setIdentityErrors] = useState({});

  // Updates identity fields — clears related errors as user types
  const updateIdentity = (updates) => {
    setIdentity((prev) => ({ ...prev, ...updates }));

    setIdentityErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const resetIdentity = () => updateIdentity(DEFAULT_IDENTITY);

  // Validates identity fields against ProjectSetupSchema
  const validate = async () => {
    const result = await validateWithYup(ProjectSetupSchema, identity);
    setIdentityErrors(result.errors || {});
    return result.isValid;
  };

  return {
    identityData: identity,
    identityErrors,

    updateIdentity,
    resetIdentity,
    validate,
    setIdentityErrors,
  };
}
