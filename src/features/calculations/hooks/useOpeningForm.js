import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import { validateOpening } from "../logic/opening/openingValidation";
import { executeOpeningCalculation } from "../logic/opening/openingCalculation";
import * as Utils from "../utils/pole-analyzer";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Maps opening type id to its display label
const TYPE_LABEL_MAP = {
  box: "Box Type",
  r: "R Type",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useOpeningForm() {
  const { type: projectType } = useParams();
  const navigate = useNavigate();

  // Read condition from sessionStorage — projectType must be available first
  const condition = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_condition`) || "{}",
      );
    } catch {
      return {};
    }
  })();

  // ── Persisted state ──

  // Opening type selection (box / r)
  const [openingType, setOpeningType] = useProjectStorage(
    projectType,
    "openingType",
    { type: "" },
  );

  // Box type dimension inputs
  const [boxType, setBoxType] = useProjectStorage(projectType, "boxType", {
    boxWidth: "",
    opWidth: "",
    boxHeight: "",
    opSurfaceHeight: "",
    opLength: "",
  });

  // R type dimension inputs
  const [rType, setRType] = useProjectStorage(projectType, "rType", {
    opWidth: "",
    opSurfaceHeight: "",
    opLength: "",
  });

  // Calculated result — persisted so result survives reload
  const [calculatedOp, setCalculatedOp] = useProjectStorage(
    projectType,
    "calculatedOp",
    null,
  );

  // Controls result table visibility
  const [showResultsOp, setShowResultsOp] = useProjectStorage(
    projectType,
    "showResultsOp",
    false,
  );

  // ── UI state ──

  const [openingTypeErrors, setOpeningTypeErrors] = useState({});
  const [boxTypeErrors, setBoxTypeErrors] = useState({});
  const [rTypeErrors, setRTypeErrors] = useState({});
  const [isOpeningExpanded, setIsOpeningExpanded] = useState(true);
  const [isSelectExpanded, setIsSelectExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(!!calculatedOp);
  const [toast, setToast] = useState(null);

  // ── Navigation ──

  // Determines button label, next step path, and whether this is the last step
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "opening",
  );

  // ── Helpers ──

  const showToast = (message, type = "error") => setToast({ message, type });

  // ── Update handlers ──

  // Updates opening type selection
  const updateOpeningType = (updates) =>
    Utils.updateOpeningType(openingType, updates, setOpeningType);

  // Updates box type fields
  const updateBoxType = (updates) =>
    Utils.updateBoxType(boxType, updates, setBoxType);

  // Updates R type fields
  const updateRType = (updates) => Utils.updateRType(rType, updates, setRType);

  // ── Calculation ──

  // Validates inputs then calls the opening calculation API
  const calculate = async () => {
    setOpeningTypeErrors({});
    setBoxTypeErrors({});
    setRTypeErrors({});

    const validation = await validateOpening({ openingType, boxType, rType });

    if (!validation.isValid) {
      setOpeningTypeErrors(validation.typeErrors || {});
      setBoxTypeErrors(validation.boxErrors || {});
      setRTypeErrors(validation.rErrors || {});
      showToast(validation.message);
      return;
    }

    try {
      setLoading(true);

      const data = await executeOpeningCalculation({
        openingType,
        boxType,
        rType,
      });

      // Persist result alongside its opening type for the result table
      setCalculatedOp({ ...data, openingType });
      setIsCalculated(true);
      setShowResultsOp(true);
    } catch (err) {
      showToast(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation ──

  // Navigates to next step — returns "OPEN_COVER" signal if this is the last step
  const finish = () => {
    if (!isCalculated) return;
    if (isLast) return "OPEN_COVER";
    navigate(`/calculation/${projectType}/${nextStep}`);
  };

  // ── Return ──

  return {
    openingType,
    boxType,
    rType,
    calculatedOp,
    showResultsOp,

    openingTypeErrors,
    boxTypeErrors,
    rTypeErrors,
    isOpeningExpanded,
    isSelectExpanded,
    isCalculated,
    loading,
    toast,

    typeLabelMap: TYPE_LABEL_MAP,
    buttonLabel,

    setToast,
    setIsOpeningExpanded,
    setIsSelectExpanded,

    updateOpeningType,
    updateBoxType,
    updateRType,
    calculate,
    finish,
    showToast,
  };
}
