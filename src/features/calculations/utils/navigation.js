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

export function getStepNavigation(condition, currentStep) {
  const steps = getStepFlow(condition);

  const currentIndex = steps.indexOf(currentStep);
  const isLast = currentIndex === steps.length - 1;

  const nextStep = !isLast ? steps[currentIndex + 1] : null;

  return {
    steps,
    currentIndex,
    isLast,
    nextStep,
    buttonLabel: isLast ? "Finish" : "Next Input",
  };
}
