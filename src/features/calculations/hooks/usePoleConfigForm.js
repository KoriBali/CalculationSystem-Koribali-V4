import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils";

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

  const updatePoleConfig = (updates) => {
    let next = { ...updates };

    if ("groundPosition" in updates) {
      next.lowestHeight = updates.groundPosition === "onGL" ? 0 : "";
    }

    Utils.updatePoleConfig(poleConfig, next, setPoleConfig);

    // ✅ Clear error untuk field yang baru diubah
    setPoleConfigErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(next).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  return {
    poleConfig,
    poleConfigErrors,
    setPoleConfigErrors,
    updatePoleConfig,
  };
}
