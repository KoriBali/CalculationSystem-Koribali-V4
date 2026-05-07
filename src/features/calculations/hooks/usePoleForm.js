// hooks/usePoleSection.js
import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";

import { validatePole } from "../validation/poleValidation";

import * as Utils from "../../utils/pole-analyzer";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DEFAULT_POLE = {
  id: "1",
  name: "",
  material: "STK400",
  type: "Straight",
  lowerDiameter: "",
  upperDiameter: "",
  lowerThickness: "",
  upperThickness: "",
  height: "",
  quantity: "1",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function usePoleSection(projectType) {
  const [poles, setPoles] = useProjectStorage(projectType, "poles", [
    DEFAULT_POLE,
  ]);

  const [poleErrors, setPoleErrors] = useState({});
  const [activeTab, setActiveTab] = useState("1");

  // Persist max pole ID to prevent ID conflicts after reload
  const poleIdRef = useRef(1);

  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_poles`);

    if (!saved) return;

    const parsed = JSON.parse(saved);

    const maxId = Math.max(0, ...parsed.map((pole) => Number(pole.id)));

    poleIdRef.current = maxId + 1;
  }, [projectType]);

  // Ensure active tab always points to a valid pole
  useEffect(() => {
    if (poles.length === 0) return;

    const isActiveTabValid = poles.some((pole) => pole.id === activeTab);

    if (!isActiveTabValid) {
      setActiveTab(poles[0].id);
    }
  }, [poles, activeTab]);

  // ─── DERIVED STATE ─────────────────────────────────────────────────────────

  const activePole = poles.find((pole) => pole.id === activeTab) ?? poles[0];

  const activeIndex = poles.findIndex((pole) => pole.id === activeTab);

  const isFirstPole = activeIndex === 0;
  const isLastPole = activeIndex === poles.length - 1;
  const isOnlyPole = poles.length === 1;

  const isNextDisabled = isOnlyPole || isLastPole;
  const isBackDisabled = isOnlyPole || isFirstPole;

  // ─── HANDLERS ──────────────────────────────────────────────────────────────

  // Add new pole section (max 6)
  const addPole = () =>
    Utils.addSection(poles, setPoles, setActiveTab, poleIdRef);

  // Remove pole section by ID
  const removePole = (poleId) =>
    Utils.removeSection(poleId, poles, setPoles, activeTab, setActiveTab);

  // Update pole fields and clear related errors
  const updatePole = (id, updates) => {
    Utils.updateSection(id, updates, setPoles, poles);

    Utils.clearSectionError(id, updates, setPoleErrors);
  };

  // Reset active pole to default values
  const resetActivePole = () => Utils.resetCurrent(setPoles, poles, activeTab);

  // Navigate to next pole tab
  const goToNext = () => Utils.goToNextSection(poles, activeTab, setActiveTab);

  // Navigate to previous pole tab
  const goToPrev = () => {
    if (isBackDisabled) return;

    setActiveTab(poles[activeIndex - 1].id);
  };

  // Yup-based validation helper
  const isPoleFilled = async (pole) => {
    const result = await validatePole(pole);
    return result.isValid;
  };

  return {
    // State
    poles,
    poleErrors,
    activeTab,
    activePole,
    poleIdRef,

    // Navigation flags
    isNextDisabled,
    isBackDisabled,

    // Setters
    setActiveTab,
    setPoleErrors,

    // Handlers
    addPole,
    removePole,
    updatePole,
    resetActivePole,
    goToNext,
    goToPrev,

    // Validation helpers
    isPoleFilled,
  };
}
