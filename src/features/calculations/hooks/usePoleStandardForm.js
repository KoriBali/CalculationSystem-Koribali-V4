// hooks/usePoleStandard.js
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../../utils/pole-analyzer";

export function usePoleStandard(projectType) {
  // Pole type selector (taper / straight)
  const [poleType, setPoleType] = useProjectStorage(
    projectType,
    "poleTypeStandard",
    {
      poleShape: "",
    },
  );

  // Taper pole fields (poleStandard, groundPosition, height)
  const [taperPole, setTaperPole] = useProjectStorage(
    projectType,
    "poleBasic",
    {
      poleType: "",
      groundPosition: "",
      height: "",
    },
  );

  // Straight (stepped) pole fields
  const [steppedPole, setSteppedPole] = useProjectStorage(
    projectType,
    "stepPoleStandard",
    {
      poleType: "steppedPole",
      combinationGroup: "",
      combination: "",
      upperThickness: "",
      upperLength: "",
      lowerThickness: "",
      lowerLength: "",
      embedmentLength: "",
      groundPosition: "onGL",
      heightDepth: "0",
    },
  );

  const [steppedPoleErrors, setSteppedPoleErrors] = useState({});

  // Updates pole type selection
  const updatePoleType = (updates) =>
    Utils.updatePoleTypeStandard(poleType, updates, setPoleType);

  // Updates taper pole fields
  const updateTaperPole = (updates) =>
    Utils.updatePoleBasic(taperPole, updates, setTaperPole);

  // Updates stepped pole fields — resets heightDepth when switching to onGL
  const updateSteppedPole = (updates) => {
    let next = { ...updates };

    if ("groundPosition" in updates) {
      next.heightDepth = updates.groundPosition === "onGL" ? 0 : "";
    }

    Utils.updateStepPoleStandard(steppedPole, next, setSteppedPole);
    Utils.clearError(next, setSteppedPoleErrors);
  };

  const isPoleTypeComplete = () => Utils.poleTypeStandardComplete(poleType);
  const isSteppedPoleComplete = () =>
    Utils.stepPoleStandardComplete(steppedPole, condition);

  return {
    // State
    poleType,
    taperPole,
    steppedPole,
    steppedPoleErrors,

    // Setters
    setSteppedPoleErrors,

    // Handlers
    updatePoleType,
    updateTaperPole,
    updateSteppedPole,
    isPoleTypeComplete,
    isSteppedPoleComplete,
  };
}
