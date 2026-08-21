// ====================================================
// Function for all calculation pages
// ====================================================
export function getStepFlow(condition) {
  const steps = ["pole"];

  if (condition.openingEnabled) steps.push("opening");
  if (condition.baseplateEnabled) steps.push("baseplate");
  if (condition.foundationEnabled) steps.push("foundation");

  return steps;
}

export function getStepNavigation(condition, currentStep, withReport = false) {
  const steps = getStepFlow(condition);

  const currentIndex = steps.indexOf(currentStep);
  const isLast = currentIndex === steps.length - 1;
  const isFirst = currentIndex === 0;

  const nextStep = !isLast ? steps[currentIndex + 1] : null;
  const prevStep = !isFirst ? steps[currentIndex - 1] : null;

  return {
    steps,
    currentIndex,
    isLast,
    nextStep,
    prevStep,
    buttonLabel: isLast ? (withReport ? "Generate Report" : "Save & Finish") : "Next Input",
  };
}
