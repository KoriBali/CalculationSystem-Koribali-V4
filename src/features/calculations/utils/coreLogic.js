// ===============================================================================
// FUNCTIONS: Check whether the session contains any meaningful calculation data
// ===============================================================================

// Keys that represent user-filled data (excludes projectType itself)
export const DATA_KEYS = [
  "cover",
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
  if (localStorage.getItem(`${projectType}_calculation_config`) !== null) {
    return true;
  }

  // Check if cover data has been filled
  const coverRaw = localStorage.getItem(`${projectType}_cover`);
  if (coverRaw) {
    try {
      const cover = JSON.parse(coverRaw);
      // If any of the cover fields have actual text entered, we have data.
      if (Object.values(cover).some((val) => typeof val === "string" && val.trim() !== "")) {
        return true;
      }
    } catch (e) {
      // ignore JSON error
    }
  }

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
    (key) => localStorage.getItem(`${projectType}_${key}`) !== null,
  );
};

// ===============================================================================
// FUNCTIONS: Completely reset all calculation data, UI states, and storage
// ===============================================================================
export const clearCalculationSession = (projectType) => {
  // All keys except "calculation_config" which is handled separately below
  const keys = DATA_KEYS.filter((k) => k !== "calculation_config");

  keys.forEach((key) => localStorage.removeItem(`${projectType}_${key}`));

  localStorage.removeItem(`${projectType}_calculation_config`);
};


// ===============================================================================
// DRAFT MANAGEMENT LOGIC
// ===============================================================================

export const getDraftsIndex = (projectType) => {
  const raw = localStorage.getItem(`${projectType}_drafts_index`);
  return raw ? JSON.parse(raw) : [];
};

export const saveDraftsIndex = (projectType, drafts) => {
  localStorage.setItem(`${projectType}_drafts_index`, JSON.stringify(drafts));
};

export const getDraftData = (projectType, draftId) => {
  const raw = localStorage.getItem(`${projectType}_draft_data_${draftId}`);
  return raw ? JSON.parse(raw) : null;
};

// Serializes the current active working session into an object
export const serializeWorkingSession = (projectType) => {
  const data = {};
  DATA_KEYS.forEach(key => {
    const val = localStorage.getItem(`${projectType}_${key}`);
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
      localStorage.setItem(`${projectType}_${key}`, val);
    });
  }
};

// Saves the current working session to a specific draft ID
export const saveWorkingSessionToDraft = (projectType, draftId, defaultTitle = "Untitled") => {
  const data = serializeWorkingSession(projectType);
  
  // Extract title/subtitle from cover data if available
  let title = defaultTitle;
  let subtitle = "No request number";
  if (data.cover) {
    try {
      const cover = JSON.parse(data.cover);
      if (cover.projectName?.trim()) title = cover.projectName.trim();
      if (cover.requestNumber?.trim()) subtitle = cover.requestNumber.trim();
    } catch(e) {}
  }

  // Save the draft data payload
  localStorage.setItem(`${projectType}_draft_data_${draftId}`, JSON.stringify(data));

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
  localStorage.removeItem(`${projectType}_draft_data_${draftId}`);
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
  const activeDraftId = localStorage.getItem(`${projectType}_active_draft_id`);
  
  if (activeDraftId && activeDraftId !== targetDraftId) {
    // Auto-save the previous draft before transitioning
    saveWorkingSessionToDraft(projectType, activeDraftId);
  }

  if (targetDraftId && targetDraftId !== activeDraftId) {
    const draftData = getDraftData(projectType, targetDraftId);
    deserializeWorkingSession(projectType, draftData); // Load target draft into working session
    localStorage.setItem(`${projectType}_active_draft_id`, targetDraftId);
  } else if (!targetDraftId) {
    clearCalculationSession(projectType);
    clearActiveDraftId(projectType);
  }
};

export const clearActiveDraftId = (projectType) => {
  localStorage.removeItem(`${projectType}_active_draft_id`);
};
