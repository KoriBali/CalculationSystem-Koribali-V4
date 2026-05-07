// hooks/useOverheadWire.js
import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../../utils/pole-analyzer";

export function useOverheadWire(projectType) {
  const [overheadWires, setOverheadWires] = useProjectStorage(
    projectType,
    "overheadWires",
    [],
  );
  const [ohwErrors, setOhwErrors] = useState({});
  const [ohwClipboard, setOhwClipboard] = useState(null);
  const [ohwInputValue, setOhwInputValue] = useState("");
  const [confirmReduceOhw, setConfirmReduceOhw] = useState(null);
  const [confirmDeleteOhw, setConfirmDeleteOhw] = useState(null);

  // Persists max OHW ID to prevent ID conflicts after reload
  const ohwIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_overheadWires`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const maxId = Math.max(0, ...parsed.map((s) => Number(s.idOhw)));
    ohwIdRef.current = maxId + 1;
  }, [projectType]);

  // Adds OHWs by quantity input — triggers reduce confirm if count decreases
  const addOhwByInput = () => {
    Utils.syncOhwByInput(
      ohwInputValue,
      overheadWires,
      setOverheadWires,
      ohwIdRef,
      setConfirmReduceOhw,
    );
    setOhwInputValue("");
  };

  // Adds a single new OHW by button click
  const addOhw = () => Utils.addOhw(overheadWires, setOverheadWires, ohwIdRef);

  // Copies an OHW to clipboard
  const copyOhw = (overheadWire) =>
    Utils.copyOhw(overheadWire, setOhwClipboard);

  // Pastes clipboard OHW into a specific slot
  const pasteOhw = (idOhw) =>
    Utils.pasteOhw(idOhw, setOverheadWires, ohwClipboard);

  // Removes an OHW by ID
  const removeOhw = (idOhw) =>
    Utils.removeOhw(idOhw, overheadWires, setOverheadWires);

  // Updates a specific OHW's fields and clears related errors
  const updateOhw = (idOhw, updates) => {
    Utils.updateOhw(idOhw, updates, setOverheadWires, overheadWires);
    Utils.clearOhwError(idOhw, updates, setOhwErrors);
  };

  // Resets a specific OHW's fields to empty
  const resetOhw = (idOhw) =>
    Utils.resetCurrentOhw(setOverheadWires, overheadWires, idOhw);

  // Confirms reduce — slices OHW list to target count
  const confirmReduce = () => {
    setOverheadWires((prev) => prev.slice(0, confirmReduceOhw.to));
    setConfirmReduceOhw(null);
  };

  // Cancels reduce — restores input value to current OHW count
  const cancelReduce = () => {
    setOhwInputValue(overheadWires.length.toString());
    setConfirmReduceOhw(null);
  };

  // Checks if a single OHW's required fields are all filled
  const isOhwComplete = (overheadWire) => Utils.isOhwComplete(overheadWire);

  return {
    // State
    overheadWires,
    ohwErrors,
    ohwClipboard,
    ohwInputValue,
    confirmReduceOhw,
    confirmDeleteOhw,

    // Setters
    setOhwErrors,
    setOhwInputValue,
    setConfirmDeleteOhw,

    // Handlers
    addOhwByInput,
    addOhw,
    copyOhw,
    pasteOhw,
    removeOhw,
    updateOhw,
    resetOhw,
    confirmReduce,
    cancelReduce,
    isOhwComplete,
  };
}
