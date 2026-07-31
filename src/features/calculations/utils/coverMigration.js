// One-time migration helpers — split the legacy combined `${type}_cover`
// blob (identity + workflow + report-cover fields all mixed together)
// into the new `${type}_projectIdentity` and `${type}_workflow` keys.
//
// Both computeInitial* functions are called synchronously inside
// useProjectStorage's lazy useState initializer, so the migrated value
// is written on first render — before any persist-effect can overwrite
// it with empty defaults.

const readLegacyCover = (projectType) => {
  try {
    const raw = sessionStorage.getItem(`${projectType}_cover`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// One-time seed for `${type}_projectIdentity` from the legacy cover blob.
export const computeInitialIdentity = (projectType, defaultIdentity) => {
  if (sessionStorage.getItem(`${projectType}_projectIdentity`) !== null) {
    return defaultIdentity;
  }
  const legacy = readLegacyCover(projectType);
  if (!legacy || legacy.requestNo === undefined) return defaultIdentity;

  return {
    requestNo: legacy.requestNo ?? "",
    companyName: legacy.companyName ?? "",
    requestType: legacy.requestType ?? "New",
    projectNo: legacy.projectNo ?? "",
    requestedDueDate: legacy.requestedDueDate ?? "",
    projectName: legacy.projectName ?? "",
  };
};

// One-time seed for `${type}_workflow` from the legacy cover blob.
// Handles both the `projectMode` shape and the older `withDrawing` boolean shape.
export const computeInitialWorkflow = (projectType, defaultWorkflow) => {
  if (sessionStorage.getItem(`${projectType}_workflow`) !== null) {
    return defaultWorkflow;
  }
  const legacy = readLegacyCover(projectType);
  if (!legacy) return defaultWorkflow;

  const hasLegacyWorkflowData =
    legacy.projectMode !== undefined ||
    legacy.withDrawing !== undefined ||
    legacy.withReport !== undefined;
  if (!hasLegacyWorkflowData) return defaultWorkflow;

  let projectMode = legacy.projectMode;
  if (projectMode === undefined) {
    projectMode = legacy.withDrawing ? "both" : "calculation";
  }

  return {
    projectMode: projectMode ?? "calculation",
    withReport: legacy.withReport ?? false,
  };
};
