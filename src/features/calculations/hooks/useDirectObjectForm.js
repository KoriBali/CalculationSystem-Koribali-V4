import { useState, useEffect, useRef } from "react";
import { useProjectStorage } from "./useProjectStorage";
import * as Utils from "../utils/pole-analyzer";

// Manages direct object list state — add, remove, update, copy/paste
export function useDirectObjectForm(projectType) {
  const [directObjects, setDirectObjects] = useProjectStorage(
    projectType,
    "directObjects",
    [],
  );
  const [doErrors, setDoErrors] = useState({});
  const [doClipboard, setDoClipboard] = useState(null);
  const [doInputValue, setDoInputValue] = useState("");
  const [confirmReduceDo, setConfirmReduceDo] = useState(null);
  const [confirmDeleteDo, setConfirmDeleteDo] = useState(null);

  // Persists max DO ID to prevent conflicts after reload
  const doIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem(`${projectType}_directObjects`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const maxId = Math.max(0, ...parsed.map((d) => Number(d.idDo)));
    doIdRef.current = maxId + 1;
  }, [projectType]);

  // Adds DOs by quantity input — triggers reduce confirm if count decreases
  const addDoByInput = () => {
    Utils.syncDoByInput(
      doInputValue,
      directObjects,
      setDirectObjects,
      doIdRef,
      setConfirmReduceDo,
    );
    setDoInputValue("");
  };

  // Adds a single new DO by button click
  const addDo = () => Utils.addDo(directObjects, setDirectObjects, doIdRef);

  // Copies a DO to clipboard
  const copyDo = (directObject) => Utils.copyDo(directObject, setDoClipboard);

  // Pastes clipboard DO into a specific slot
  const pasteDo = (idDo) => Utils.pasteDo(idDo, setDirectObjects, doClipboard);

  // Removes a DO by ID
  const removeDo = (idDo) =>
    Utils.removeDo(idDo, directObjects, setDirectObjects);

  // Updates a specific DO's fields and clears related errors
  const updateDo = (idDo, updates) => {
    Utils.updateDo(idDo, updates, setDirectObjects, directObjects);
    Utils.clearDoError(idDo, updates, setDoErrors);
  };

  // Resets a specific DO's fields to empty
  const resetDo = (idDo) =>
    Utils.resetCurrentDo(setDirectObjects, directObjects, idDo);

  // Confirms reduce — slices DO list to target count
  const confirmReduce = () => {
    setDirectObjects((prev) => prev.slice(0, confirmReduceDo.to));
    setConfirmReduceDo(null);
  };

  // Cancels reduce — restores input value to current DO count
  const cancelReduce = () => {
    setDoInputValue(directObjects.length.toString());
    setConfirmReduceDo(null);
  };

  return {
    directObjects,
    doErrors,
    doClipboard,
    doInputValue,
    confirmReduceDo,
    confirmDeleteDo,

    setDoErrors,
    setDoInputValue,
    setConfirmDeleteDo,

    addDoByInput,
    addDo,
    copyDo,
    pasteDo,
    removeDo,
    updateDo,
    resetDo,
    confirmReduce,
    cancelReduce,
  };
}
