import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import { validateOpening } from "../logic/opening/openingValidation";
import { executeOpeningCalculation } from "../logic/opening/openingCalculation";
import * as Utils from "../utils";
import { scrollToFirstError, firstErrorMessage } from "../utils/scrollToError";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Maps opening type id to its display label
const TYPE_LABEL_MAP = {
  box: "Box Type",
  r: "R Type",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useOpeningForm() {
  const { type: projectType, draftId } = useParams();
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

  // Read workflow flags from sessionStorage
  const workflow = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_workflow`) || "{}"
      ) || {};
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
    openingDirection: "",
  });

  // R type dimension inputs
  const [rType, setRType] = useProjectStorage(projectType, "rType", {
    opWidth: "",
    opSurfaceHeight: "",
    opLength: "",
    openingDirection: "",
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
  const isCalculated = !!calculatedOp;
  const [toast, setToast] = useState(null);

  // ── Navigation ──

  // Determines button label, next step path, and whether this is the last step
  const { buttonLabel, nextStep, prevStep, isLast } = Utils.getStepNavigation(
    condition,
    "opening",
    workflow.withReport
  );

  const isCalculationAndDrawing = workflow.projectMode === "both";

  // ── Helpers ──

  const showToast = (message, type = "error") => setToast({ message, type });

  // ── Update handlers ──

  // Updates opening type selection
  const updateOpeningType = (updates) => {
    Utils.updateOpeningType(openingType, updates, setOpeningType);

    // Hapus error spesifik saat field diupdate
    setOpeningTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // Updates box type fields
  const updateBoxType = (updates) => {
    Utils.updateBoxType(boxType, updates, setBoxType);

    // Hapus error spesifik saat field diupdate
    setBoxTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // Updates R type fields
  const updateRType = (updates) => {
    Utils.updateRType(rType, updates, setRType);

    // Hapus error spesifik saat field diupdate
    setRTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // ── Calculation ──

  // Validates inputs then calls the opening calculation API
  const calculate = async () => {
    setOpeningTypeErrors({});
    setBoxTypeErrors({});
    setRTypeErrors({});

    const validation = await validateOpening({
      openingType,
      boxType,
      rType,
      isCalculationAndDrawing,
    });

    if (!validation.isValid) {
      setOpeningTypeErrors(validation.typeErrors || {});
      setBoxTypeErrors(validation.boxErrors || {});
      setRTypeErrors(validation.rErrors || {});

      const firstErrors =
        validation.typeErrors || validation.boxErrors || validation.rErrors || {};
      showToast(firstErrorMessage(firstErrors) || validation.message);
      scrollToFirstError(firstErrors);
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
    navigate(`/calculation/${projectType}/${draftId}/${nextStep}`);
  };

  // Navigates back to the previous step (always "pole" for opening)
  const goBack = () => {
    navigate(`/calculation/${projectType}/${draftId}/${prevStep}`);
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
    isCalculationAndDrawing,

    setToast,
    setIsOpeningExpanded,
    setIsSelectExpanded,

    updateOpeningType,
    updateBoxType,
    updateRType,
    calculate,
    finish,
    goBack,
    showToast,
  };
}
