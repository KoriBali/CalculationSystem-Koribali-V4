// hooks/useArm.js
import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../../utils/pole-analyzer";

export function useArm(projectType) {
  const [arms, setArms] = useProjectStorage(projectType, "arms", []);
  const [armsErrors, setArmsErrors] = useState({});
  const [aoErrors, setAoErrors] = useState({});
  const [activeTabArm, setActiveTabArm] = useState("1");
  const [armClipboard, setArmClipboard] = useState(null);
  const [aoClipboard, setAoClipboard] = useState(null);
  const [aoInputValue, setAoInputValue] = useState("");
  const [confirmDeleteArm, setConfirmDeleteArm] = useState(null);
  const [confirmDeleteAo, setConfirmDeleteAo] = useState(null);
  const [confirmReduceAo, setConfirmReduceAo] = useState(null);

  // Persists max Arm ID
  const armIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_arms`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const maxId = Math.max(0, ...parsed.map((s) => Number(s.idArm)));
    armIdRef.current = maxId + 1;
  }, [projectType]);

  // Persists max Arm Object ID across all arms
  const aoIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_arms`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const allAoIds = parsed.flatMap(
      (arm) => arm.armObjects?.map((o) => Number(o.idAo)) || [],
    );
    const maxId = Math.max(0, ...allAoIds);
    aoIdRef.current = maxId + 1;
  }, [projectType]);

  // Guards active tab — resets to first arm if active becomes invalid
  useEffect(() => {
    if (arms.length === 0) return;
    const isValid = arms.some((a) => a.idArm === activeTabArm);
    if (!isValid) setActiveTabArm(arms[0].idArm);
  }, [arms, activeTabArm]);

  // Derived state
  const activeArm = arms.find((a) => a.idArm === activeTabArm);
  const armObjects = activeArm?.armObjects || [];
  const currentIndex = arms.findIndex((a) => a.idArm === activeTabArm);
  const isNextDisabledArm =
    arms.length === 1 || currentIndex === arms.length - 1;
  const isBackDisabledArm = arms.length === 1 || currentIndex === 0;

  // Updates arm objects for the currently active arm only
  const updateActiveArmObjects = (newObjects) => {
    setArms((prev) =>
      prev.map((arm) =>
        arm.idArm === activeTabArm ? { ...arm, armObjects: newObjects } : arm,
      ),
    );
  };

  // ── Arm handlers ──

  const addArm = () => Utils.addArm(arms, setArms, setActiveTabArm, armIdRef);
  const copyArm = (arm) => Utils.copyArm(arm, setArmClipboard);
  const pasteArm = (idArm) => Utils.pasteArm(idArm, setArms, armClipboard);
  const removeArm = (idArm) =>
    Utils.removeArm(idArm, setArms, activeTabArm, setActiveTabArm);

  const updateArm = (idArm, updates) => {
    Utils.updateArm(idArm, updates, setArms, arms);
    Utils.clearArmError(idArm, updates, setArmsErrors);
  };

  const resetArm = () => Utils.resetCurrentArm(setArms, arms, activeTabArm);
  const isArmComplete = (arm) => Utils.isArmComplete(arm);

  // ── Arm Object handlers ──

  const addAoByInput = () => {
    Utils.syncAoByInput(
      aoInputValue,
      armObjects,
      updateActiveArmObjects,
      aoIdRef,
      setConfirmReduceAo,
    );
    setAoInputValue("");
  };

  const addAo = () => Utils.addAo(armObjects, updateActiveArmObjects, aoIdRef);
  const copyAo = (ao) => Utils.copyAo(ao, setAoClipboard);
  const pasteAo = (idAo) =>
    Utils.pasteAo(idAo, armObjects, updateActiveArmObjects, aoClipboard);
  const removeAo = (idAo) =>
    Utils.removeAo(idAo, armObjects, updateActiveArmObjects);

  const updateAo = (idAo, updates) => {
    Utils.updateAo(idAo, updates, armObjects, updateActiveArmObjects);
    Utils.clearAoError(idAo, updates, setAoErrors);
  };

  const resetAo = (idAo) =>
    Utils.resetCurrentAo(idAo, armObjects, updateActiveArmObjects);
  const isAoComplete = (ao) => Utils.isAoComplete(ao);

  const confirmReduceArmObjects = () => {
    updateActiveArmObjects(armObjects.slice(0, confirmReduceAo.to));
    setConfirmReduceAo(null);
  };

  const cancelReduceArmObjects = () => {
    setAoInputValue(armObjects.length.toString());
    setConfirmReduceAo(null);
  };

  return {
    // State
    arms,
    armsErrors,
    aoErrors,
    activeTabArm,
    activeArm,
    armObjects,
    currentIndex,
    armClipboard,
    aoClipboard,
    aoInputValue,
    confirmDeleteArm,
    confirmDeleteAo,
    confirmReduceAo,

    // Navigation flags
    isNextDisabledArm,
    isBackDisabledArm,

    // Setters
    setActiveTabArm,
    setArmsErrors,
    setAoErrors,
    setAoInputValue,
    setConfirmDeleteArm,
    setConfirmDeleteAo,

    // Arm handlers
    addArm,
    copyArm,
    pasteArm,
    removeArm,
    updateArm,
    resetArm,
    isArmComplete,

    // Arm Object handlers
    addAoByInput,
    addAo,
    copyAo,
    pasteAo,
    removeAo,
    updateAo,
    resetAo,
    isAoComplete,
    confirmReduceArmObjects,
    cancelReduceArmObjects,
  };
}
