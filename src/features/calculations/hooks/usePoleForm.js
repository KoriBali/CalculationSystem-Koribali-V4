import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils";

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
  zHeight: "",
  quantity: "1",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages pole poles state — add, remove, update, navigate between tabs
export function usePoleForm(projectType) {
  const [poles, setPoles] = useProjectStorage(projectType, "poles", [
    DEFAULT_POLE,
  ]);
  const [poleErrors, setPoleErrors] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [poleClipboard, setPoleClipboard] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmReducePole, setConfirmReducePole] = useState(null);
  const [poleCountInput, setPoleCountInput] = useState("");

  // Persists max pole ID to prevent conflicts after reload
  const poleIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_poles`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const maxId = Math.max(0, ...parsed.map((p) => Number(p.id)));
    poleIdRef.current = maxId + 1;
  }, [projectType]);

  // Guards active tab — resets to first pole if active tab becomes invalid
  useEffect(() => {
    if (poles.length === 0) return;
    const isValid = poles.some((p) => p.id === activeTab);
    if (!isValid) setActiveTab(poles[0].id);
  }, [poles, activeTab]);

  // Derived navigation state
  const activeIndex = poles.findIndex((p) => p.id === activeTab);
  const activePole = poles[activeIndex];
  const isNextDisabled = poles.length === 1 || activeIndex === poles.length - 1;
  const isBackDisabled = poles.length === 1 || activeIndex === 0;

  // Adds a new pole (max 6)
  const addPole = () => Utils.addPole(poles, setPoles, setActiveTab, poleIdRef);

  // Bulk adds poles based on input
  const handleAddPoleBulk = () => {
    const num = Number(poleCountInput);
    if (!num || isNaN(num) || num <= 0) return;
    
    // minimum 1, max 6
    const safeTarget = Math.min(Math.max(1, num), 6);
    const currentCount = poles.length;
    
    if (safeTarget === currentCount) return;

    if (safeTarget > currentCount) {
      const toAdd = safeTarget - currentCount;
      setPoles((prev) => {
        const newPoles = [...prev];
        let nextId = poleIdRef.current;
        for (let i = 0; i < toAdd; i++) {
          newPoles.push({
            ...DEFAULT_POLE,
            id: String(nextId),
          });
          nextId++;
        }
        poleIdRef.current = nextId;
        return newPoles;
      });
      setPoleCountInput("");
    } else {
      // reduce
      setConfirmReducePole({
        from: currentCount,
        to: safeTarget,
      });
    }
  };

  // Confirms reduce — slices Pole list to target count
  const confirmReduce = () => {
    setPoles((prev) => prev.slice(0, confirmReducePole.to));
    setConfirmReducePole(null);
    setPoleCountInput("");
  };

  // Cancels reduce — restores input value to current Pole count
  const cancelReduce = () => {
    setPoleCountInput(poles.length.toString());
    setConfirmReducePole(null);
  };

  // Removes a pole by ID
  const removePole = (id) =>
    Utils.removePole(id, poles, setPoles, activeTab, setActiveTab);

  const copyPole = (pole) => Utils.copyPole(pole, setPoleClipboard);

  const pastePole = (id) => {
    Utils.pastePole(id, setPoles, poleClipboard);

    if (!poleClipboard) return;

    setPoleErrors((prev) => {
      if (!prev[id]) return prev;
      const updatedPoleErrors = { ...prev[id] };
      Object.keys(poleClipboard).forEach((key) => {
        const val = poleClipboard[key];
        const isEmpty = val === "" || val === null || val === undefined;
        if (!isEmpty) delete updatedPoleErrors[key];
      });
      return { ...prev, [id]: updatedPoleErrors };
    });
  };

  // Updates a specific pole's fields and clears related errors
  const updatePole = (id, updates) => {
    Utils.updatePole(id, updates, setPoles, poles);

    // Clear error untuk field yang baru diubah, berdasarkan pole id
    setPoleErrors((prev) => {
      if (!prev[id]) return prev;
      const updatedPoleErrors = { ...prev[id] };
      Object.keys(updates).forEach((key) => delete updatedPoleErrors[key]);
      return { ...prev, [id]: updatedPoleErrors };
    });
  };

  // Resets the active pole's fields to empty
  const resetActivePole = (id = activeTab) => {
    // 1. Reset nilai inputannya
    Utils.resetCurrentPole(setPoles, poles, id);

    // 2. Hapus semua error khusus untuk pole yang sedang aktif ini
    setPoleErrors((prev) => {
      const clearedErrors = { ...prev };
      delete clearedErrors[id]; // Langsung hapus error berdasarkan ID tab-nya
      return clearedErrors;
    });
  };

  // Navigates to the next pole tab
  const goToNext = () => {
    if (!isNextDisabled) setActiveTab(poles[activeIndex + 1].id);
  };

  // Navigates to the previous pole tab
  const goToPrev = () => {
    if (!isBackDisabled) setActiveTab(poles[activeIndex - 1].id);
  };

  return {
    poles,
    poleErrors,
    activeTab,
    activePole,
    activeIndex,
    isNextDisabled,
    isBackDisabled,
    poleClipboard,

    setPoleErrors,
    setActiveTab,
    confirmDelete,
    setConfirmDelete,

    addPole,
    removePole,
    updatePole,
    copyPole,
    pastePole,
    resetActivePole,
    goToNext,
    goToPrev,
    poleCountInput,
    setPoleCountInput,
    handleAddPoleBulk,
    confirmReducePole,
    confirmReduce,
    cancelReduce,
  };
}
