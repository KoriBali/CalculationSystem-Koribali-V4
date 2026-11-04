export const getRows = (poleIndex, resultPole) => {
  const currentStep = resultPole[poleIndex];

  const rows = [];

  const rawSf =
    currentStep?.safetyFactor ??
    currentStep?.utilizationRatio ??
    null;

  const sf =
    rawSf != null && !Number.isNaN(Number(rawSf))
      ? Number(Number(rawSf).toFixed(3))
      : null;

  // =========================
  // POLE ONLY
  // =========================
  rows.push({
    type: "section",
    description:
      currentStep?.description || currentStep?.name || `Pole ${poleIndex + 1}`,
    safetyFactor: sf,
    limit: currentStep?.limit ?? 1.0,
  });

  return rows;
};
