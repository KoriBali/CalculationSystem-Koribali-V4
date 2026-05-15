import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils";

// Manages standard pole selection state — pole type, taper, and straight (stepped) pole
export function usePoleStandardForm(projectType) {
  // Pole type selector — determines which standard form is shown (taper / straight)
  const [poleTypeStandard, setPoleTypeStandard] = useProjectStorage(
    projectType,
    "poleTypeStandard",
    { type: "" },
  );

  // Taper pole fields — poleType, groundPosition, height
  const [taperPoleStandard, setTaperPoleStandard] = useProjectStorage(
    projectType,
    "taperPoleStandard",
    {
      poleType: "",
      groundPosition: "",
      height: "",
    },
  );

  // Straight (stepped) pole fields
  const [straightPoleStandard, setStraightPoleStandard] = useProjectStorage(
    projectType,
    "straightPoleStandard",
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

  const [straightPoleErrors, setStraightPoleErrors] = useState({});

  // Updates pole type selection — resets downstream fields on type change
  const updatePoleTypeStandard = (updates) =>
    Utils.updatePoleTypeStandard(
      poleTypeStandard,
      updates,
      setPoleTypeStandard,
    );

  // Updates taper pole fields
  const updateTaperPoleStandard = (updates) =>
    Utils.updatetaperPoleStandard(
      taperPoleStandard,
      updates,
      setTaperPoleStandard,
    );

  // Updates straight pole fields — resets heightDepth when switching to onGL
  const updateStraightPoleStandard = (updates) => {
    let next = { ...updates };

    if ("groundPosition" in updates) {
      next.heightDepth = updates.groundPosition === "onGL" ? 0 : "";
    }

    Utils.updatestraightPoleStandard(
      straightPoleStandard,
      next,
      setStraightPoleStandard,
    );
  };

  return {
    // State
    poleTypeStandard,
    taperPoleStandard,
    straightPoleStandard,
    straightPoleErrors,

    // Setters
    setStraightPoleErrors,

    // Handlers
    updatePoleTypeStandard,
    updateTaperPoleStandard,
    updateStraightPoleStandard,
  };
}
