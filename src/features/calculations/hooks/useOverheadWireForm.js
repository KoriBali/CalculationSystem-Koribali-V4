import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils";

// Manages overhead wire list state — add, remove, update, copy/paste
export function useOverheadWireForm(projectType) {
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

  // Persists max OHW ID to prevent conflicts after reload
  const ohwIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_overheadWires`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const maxId = Math.max(0, ...parsed.map((o) => Number(o.idOhw)));
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
  const copyOhw = (ohw) => Utils.copyOhw(ohw, setOhwClipboard);

  // Pastes clipboard OHW into a specific slot
  const pasteOhw = (idOhw) => {
    Utils.pasteOhw(idOhw, setOverheadWires, ohwClipboard);

    if (!ohwClipboard) return;

    setOhwErrors((prev) => {
      if (!prev[idOhw]) return prev;
      const updatedOhwErrors = { ...prev[idOhw] };
      Object.keys(ohwClipboard).forEach((key) => {
        const val = ohwClipboard[key];
        const isEmpty = val === "" || val === null || val === undefined;
        if (!isEmpty) delete updatedOhwErrors[key];
      });
      return { ...prev, [idOhw]: updatedOhwErrors };
    });
  };

  // Removes an OHW by ID
  const removeOhw = (idOhw) =>
    Utils.removeOhw(idOhw, overheadWires, setOverheadWires);

  // Updates a specific OHW's fields and clears related errors
  const updateOhw = (idOhw, updates) => {
    Utils.updateOhw(idOhw, updates, setOverheadWires, overheadWires);

    setOhwErrors((prev) => {
      if (!prev[idOhw]) return prev;
      const updatedOhwErrors = { ...prev[idOhw] };
      Object.keys(updates).forEach((key) => delete updatedOhwErrors[key]);
      return { ...prev, [idOhw]: updatedOhwErrors };
    });
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

  return {
    overheadWires,
    ohwErrors,
    ohwClipboard,
    ohwInputValue,
    confirmReduceOhw,
    confirmDeleteOhw,

    setOhwErrors,
    setOhwInputValue,
    setConfirmDeleteOhw,

    addOhwByInput,
    addOhw,
    copyOhw,
    pasteOhw,
    removeOhw,
    updateOhw,
    resetOhw,
    confirmReduce,
    cancelReduce,
  };
}
