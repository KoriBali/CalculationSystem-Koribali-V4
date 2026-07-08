// ===============================================================================
// FUNCTIONS: Check whether the session contains any meaningful calculation data
// ===============================================================================

// Keys that represent user-filled data (excludes projectType itself)
const DATA_KEYS = [
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
  if (sessionStorage.getItem(`${projectType}_calculation_config`) !== null) {
    return true;
  }

  // Check if cover data has been filled
  const coverRaw = sessionStorage.getItem(`${projectType}_cover`);
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
    (key) => sessionStorage.getItem(`${projectType}_${key}`) !== null,
  );
};

// ===============================================================================
// FUNCTIONS: Completely reset all calculation data, UI states, and storage
// ===============================================================================
export const clearCalculationSession = (projectType) => {
  // All keys except "calculation_config" which is handled separately below
  const keys = DATA_KEYS.filter((k) => k !== "calculation_config");

  keys.forEach((key) => sessionStorage.removeItem(`${projectType}_${key}`));

  sessionStorage.removeItem(`${projectType}_calculation_config`);
  sessionStorage.removeItem("projectType");
};
