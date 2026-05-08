import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils/pole-analyzer";

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages structural design (pole config) state — lowestHeight, groundPosition, overdesignFactor
export function usePoleConfigForm(projectType) {
  const [poleConfig, setPoleConfig] = useProjectStorage(
    projectType,
    "poleConfig",
    {
      lowestHeight: "0",
      groundPosition: "onGL",
      overdesignFactor: "1",
    },
  );

  const [poleConfigErrors, setPoleConfigErrors] = useState({});

  // Updates pole config fields — resets lowestHeight when switching back to onGL
  const updatePoleConfig = (updates) => {
    let next = { ...updates };

    if ("groundPosition" in updates) {
      next.lowestHeight = updates.groundPosition === "onGL" ? 0 : "";
    }

    Utils.updatePoleConfig(poleConfig, next, setPoleConfig);
    Utils.clearError(next, setPoleConfigErrors);
  };

  return {
    poleConfig,
    poleConfigErrors,

    setPoleConfigErrors,

    updatePoleConfig,
  };
}
