// ===============================================================================
// FUNCTIONS: Check whether the session contains any meaningful calculation data
// ===============================================================================

// Keys that represent user-filled data (excludes projectType itself)
export const DATA_KEYS = [
  "cover",
  "projectIdentity",
  "workflow",
  "condition",
  "poleConfig",
  "poles",
  "directObjects",
  "overheadWires",
  "arms",
  "results",
  "resultsDo",
  "resultsOhw",
  "resultsArm",
  "showResults",
  "drawing",
  "drawing_completed",
  "openingType",
  "boxType",
  "rType",
  "baseplateType",
  "fourRibType",
  "eightRibType",
  "foundationType",
  "squareCaisson",
  "roundCaisson",
  "poleTypeStandard",
  "taperPoleStandard",
  "straightPoleStandard",
  "hasReport",
  "showResultsOp",
  "calculatedOp",
  "showResultsBaseplate",
  "calculatedBaseplate",
  "calculatedFoundation",
  "showResultsFoundation",
  "reportSnapshot",
  "calculation_config",
  "drawing",
  "drawing_completed",
  "drawing_general",
  "drawing_coupling_location",
  "drawing_coupling_count",
  "drawing_coupling_data",
  "drawing_coupling_completed",
  "drawing_surface",
  "drawing_coupling_confirmed",
];

/**
 * Returns true if the user has any meaningful calculation data for this project type.
 * Strategy:
 *  - `calculation_config` is only written when the user submits the Initial Input form (proceed()).
 *    If it exists, the user has definitely filled in and confirmed something.
 *  - Additionally check a set of "deep" keys that are only written after real user interaction
 *    (results, report, etc.), as a fallback for edge cases.
 */
export const hasCalculationData = (projectType) => {
  // Primary signal: config is only saved after the user confirms Initial Input
  if (sessionStorage.getItem(`${projectType}_calculation_config`) !== null) {
    return true;
  }

  // Check if cover or identity data has been filled
  const hasNonEmptyStringField = (raw) => {
    if (!raw) return false;
    try {
      const obj = JSON.parse(raw);
      return Object.values(obj).some((val) => typeof val === "string" && val.trim() !== "");
    } catch {
      return false;
    }
  };

  if (hasNonEmptyStringField(sessionStorage.getItem(`${projectType}_cover`))) return true;
  if (hasNonEmptyStringField(sessionStorage.getItem(`${projectType}_projectIdentity`))) return true;

  // Secondary signal: any computed/result data exists
  const deepKeys = [
    "results",
    "resultsDo",
    "resultsOhw",
    "resultsArm",
    "showResults",
    "hasReport",
    "reportSnapshot",
    "calculatedOp",
    "calculatedBaseplate",
    "calculatedFoundation",
  ];

  return deepKeys.some(
    (key) => sessionStorage.getItem(`${projectType}_${key}`) !== null,
  );
};

export const isProjectComplete = (projectType) => {
  const workflowRaw = sessionStorage.getItem(`${projectType}_workflow`);
  const workflow = workflowRaw ? JSON.parse(workflowRaw) : {};
  const mode = workflow.projectMode || "calculation";

  const isCalculationDone = () => {
    const raw = sessionStorage.getItem(`${projectType}_calculation_config`);
    if (!raw) return false;
    const config = JSON.parse(raw);
    const hasArrayData = (key) => {
      const val = sessionStorage.getItem(`${projectType}_${key}`);
      return val && val !== "null" && Array.isArray(JSON.parse(val)) && JSON.parse(val).length > 0;
    };
    const isValueSet = (key) => {
      const val = sessionStorage.getItem(`${projectType}_${key}`);
      return val !== null && val !== "null";
    };
    const hasPole = config.pole ? hasArrayData("results") : true;
    const hasOpening = config.opening ? isValueSet("calculatedOp") : true;
    const hasBaseplate = config.baseplate ? isValueSet("calculatedBaseplate") : true;
    const hasFoundation = config.foundation ? isValueSet("calculatedFoundation") : true;
    return hasPole && hasOpening && hasBaseplate && hasFoundation;
  };

  const isDrawingDone = () => {
    // Basic check for drawing completion, if drawing is implemented.
    const raw = sessionStorage.getItem(`${projectType}_drawing`);
    if (!raw) return false;
    try {
      const drawingData = JSON.parse(raw);
      return drawingData && Object.keys(drawingData).length > 0;
    } catch {
      return false;
    }
  };

  if (mode === "both") {
    return isCalculationDone() && isDrawingDone();
  } else if (mode === "drawing") {
    return isDrawingDone();
  }
  return isCalculationDone();
};

// ===============================================================================
// FUNCTIONS: Completely reset all calculation data, UI states, and storage
// ===============================================================================
export const clearCalculationSession = (projectType) => {
  // All keys except "calculation_config" which is handled separately below
  const keys = DATA_KEYS.filter((k) => k !== "calculation_config");

  keys.forEach((key) => sessionStorage.removeItem(`${projectType}_${key}`));

  sessionStorage.removeItem(`${projectType}_calculation_config`);
};


// ===============================================================================
// DRAFT MANAGEMENT LOGIC
// ===============================================================================

export const getDraftsIndex = (projectType) => {
  const raw = sessionStorage.getItem(`${projectType}_drafts_index`);
  if (!raw) return [];
  const drafts = JSON.parse(raw);
  return drafts.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
};

export const saveDraftsIndex = (projectType, drafts) => {
  sessionStorage.setItem(`${projectType}_drafts_index`, JSON.stringify(drafts));
};

export const getDraftData = (projectType, draftId) => {
  const raw = sessionStorage.getItem(`${projectType}_draft_data_${draftId}`);
  return raw ? JSON.parse(raw) : null;
};

// Serializes the current active working session into an object
export const serializeWorkingSession = (projectType) => {
  const data = {};
  DATA_KEYS.forEach(key => {
    const val = sessionStorage.getItem(`${projectType}_${key}`);
    if (val !== null) {
      data[key] = val; // Store raw stringified JSON
    }
  });
  return data;
};

// Deserializes a draft object into the active working session
export const deserializeWorkingSession = (projectType, draftData) => {
  clearCalculationSession(projectType); // Clear existing first
  if (draftData) {
    Object.entries(draftData).forEach(([key, val]) => {
      sessionStorage.setItem(`${projectType}_${key}`, val);
    });
  }
};

// Saves the current working session to a specific draft ID
export const saveWorkingSessionToDraft = (projectType, draftId, defaultTitle = "Untitled") => {
  const data = serializeWorkingSession(projectType);
  
  // Extract title/subtitle from identity data if available — falls back to
  // the legacy combined `cover` blob for drafts saved before the
  // identity/workflow/cover split.
  let title = defaultTitle;
  let subtitle = "No request number";

  const tryExtract = (raw) => {
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      return {
        name: obj.projectName?.trim() || null,
        number: obj.requestNo?.trim() || null,
      };
    } catch {
      return null;
    }
  };

  const fromIdentity = tryExtract(data.projectIdentity);
  const fromLegacyCover = tryExtract(data.cover);

  if (fromIdentity?.name) title = fromIdentity.name;
  else if (fromLegacyCover?.name) title = fromLegacyCover.name;

  if (fromIdentity?.number) subtitle = fromIdentity.number;
  else if (fromLegacyCover?.number) subtitle = fromLegacyCover.number;

  // Save the draft data payload
  sessionStorage.setItem(`${projectType}_draft_data_${draftId}`, JSON.stringify(data));

  // Update index
  const drafts = getDraftsIndex(projectType);
  const existingIdx = drafts.findIndex(d => d.id === draftId);
  const draftMeta = {
    id: draftId,
    title,
    subtitle,
    lastEdited: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    drafts[existingIdx] = draftMeta;
  } else {
    drafts.unshift(draftMeta);
  }
  saveDraftsIndex(projectType, drafts);
};

export const deleteDraft = (projectType, draftId) => {
  // Remove data
  sessionStorage.removeItem(`${projectType}_draft_data_${draftId}`);
  // Update index
  const drafts = getDraftsIndex(projectType);
  saveDraftsIndex(projectType, drafts.filter(d => d.id !== draftId));
};

// Manages switching between drafts. If the user navigated away from a draft without saving,
// this ensures the unsaved changes are preserved in that draft before loading a new one.

export const hasDraftChanged = (projectType, draftId) => {
  const currentSession = serializeWorkingSession(projectType);
  const savedDraft = getDraftData(projectType, draftId);
  
  // If it's a completely new draft (not saved yet), check if they actually inputted anything meaningful
  if (!savedDraft) {
    return hasCalculationData(projectType);
  }

  // Compare the current session with the saved draft
  const currentKeys = Object.keys(currentSession);
  const savedKeys = Object.keys(savedDraft);
  
  if (currentKeys.length !== savedKeys.length) return true;
  
  for (let key of currentKeys) {
    if (currentSession[key] !== savedDraft[key]) return true;
  }
  return false;
};

export const handleSessionTransition = (projectType, targetDraftId) => {
  const activeDraftId = sessionStorage.getItem(`${projectType}_active_draft_id`);
  
  if (activeDraftId && activeDraftId !== targetDraftId) {
    // Auto-save the previous draft before transitioning
    saveWorkingSessionToDraft(projectType, activeDraftId);
  }

  if (targetDraftId && targetDraftId !== activeDraftId) {
    const draftData = getDraftData(projectType, targetDraftId);
    deserializeWorkingSession(projectType, draftData); // Load target draft into working session
    sessionStorage.setItem(`${projectType}_active_draft_id`, targetDraftId);
  } else if (!targetDraftId) {
    clearCalculationSession(projectType);
    clearActiveDraftId(projectType);
  }
};

export const clearActiveDraftId = (projectType) => {
  sessionStorage.removeItem(`${projectType}_active_draft_id`);
};
