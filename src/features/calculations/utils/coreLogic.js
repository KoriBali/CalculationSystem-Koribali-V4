// ===============================================================================
// FUNCTIONS: Completely reset all calculation data, UI states, and storage
// ===============================================================================
export const clearCalculationSession = (projectType) => {
  const keys = [
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
  ];

  keys.forEach((key) => sessionStorage.removeItem(`${projectType}_${key}`));

  sessionStorage.removeItem(`${projectType}_calculation_config`);
  sessionStorage.removeItem("projectType");
};
