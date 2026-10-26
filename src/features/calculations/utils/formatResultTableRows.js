export const getRows = (poleIndex, resultPole) => {
  const currentStep = resultPole[poleIndex];

  const rows = [];

  // =========================
  // POLE ONLY
  // =========================
  rows.push({
    type: "section",
    description:
      currentStep?.description || currentStep?.name || `Section ${poleIndex + 1}`,
  });

  return rows;
};
