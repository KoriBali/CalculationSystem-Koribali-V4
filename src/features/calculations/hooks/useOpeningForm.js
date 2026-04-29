import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStorage } from "../../../hooks/useProjectStorage";

import { validateOpening } from "../logic/opening/openingValidation";
import { executeOpeningCalculation } from "../logic/opening/openingCalculation";

import * as Utils from "../../../utils/pole-analyzer";

// Main custom hook to manage opening form state and workflow
export function useOpeningForm() {
  const { type: projectType } = useParams();
  const navigate = useNavigate();

  // Safely retrieve condition data from session storage
  const getCondition = () => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_condition`) || "{}",
      );
    } catch {
      return {};
    }
  };

  const condition = getCondition();

  // ================= STATE =================

  // Opening type state (box / r)
  const [openingType, setOpeningType] = useProjectStorage(
    projectType,
    "openingType",
    {
      type: "",
    },
  );

  // Box type input state
  const [boxType, setBoxType] = useProjectStorage(projectType, "boxType", {
    boxWidth: "",
    opWidth: "",
    boxHeight: "",
    opSurfaceHeight: "",
    opLength: "",
  });

  // R type input state
  const [rType, setRType] = useProjectStorage(projectType, "rType", {
    opWidth: "",
    opSurfaceHeight: "",
    opLength: "",
  });

  // Calculated result state
  const [calculatedOp, setCalculatedOp] = useProjectStorage(
    projectType,
    "calculatedOp",
    null,
  );

  // Toggle to show/hide results
  const [showResultsOp, setShowResultsOp] = useProjectStorage(
    projectType,
    "showResultsOp",
    false,
  );

  // Validation error states for each section
  const [openingTypeErrors, setOpeningTypeErrors] = useState({});
  const [boxTypeErrors, setBoxTypeErrors] = useState({});
  const [rTypeErrors, setRTypeErrors] = useState({});

  // UI expand/collapse states
  const [isOpeningExpanded, setIsOpeningExpandedType] = useState(true);
  const [isSelectExpanded, setIsSelectExpanded] = useState(true);

  // Loading and calculation status
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Helper to show toast messages
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Navigation helper for multi-step flow
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "opening",
  );

  // ================= HANDLERS =================

  // Update opening type
  const handleOpeningTypeUpdate = (updates) => {
    Utils.updateOpeningType(openingType, updates, setOpeningType);
  };

  // Update Box Type inputs and clear related errors
  const handleBoxTypeUpdate = (updates) => {
    Utils.updateBoxType(boxType, updates, setBoxType);
  };

  // Update R Type inputs and clear related errors
  const handleRTypeUpdate = (updates) => {
    Utils.updateRType(rType, updates, setRType);
  };

  // Handle calculation flow (validation + API call)
  const handleCalculate = async () => {
    // Reset all error states before validation
    setOpeningTypeErrors({});
    setBoxTypeErrors({});
    setRTypeErrors({});

    // Run validation logic
    const validation = await validateOpening({
      openingType,
      boxType,
      rType,
    });

    // Handle validation failure
    if (!validation.isValid) {
      setOpeningTypeErrors(validation.typeErrors || {});
      setBoxTypeErrors(validation.boxErrors || {});
      setRTypeErrors(validation.rErrors || {});
      showToast(validation.message);
      return;
    }

    try {
      // Start loading state
      setLoading(true);

      // Execute API calculation
      const data = await executeOpeningCalculation({
        openingType,
        boxType,
        rType,
      });

      // Save calculated result
      setCalculatedOp({
        ...data,
        openingType,
      });

      // Update UI state after success
      setIsCalculated(true);
      setShowResultsOp(true);
    } catch (err) {
      // Handle API or unexpected errors
      showToast(err?.message || "Something went wrong");
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Handle navigation to next step or finish flow
  const handleFinish = () => {
    if (!isCalculated) return;

    if (isLast) {
      return "OPEN_COVER";
    }

    navigate(`/calculation/${projectType}/${nextStep}`);
  };

  // Mapping for UI labels
  const typeLabelMap = {
    box: "Box Type",
    r: "R Type",
  };

  // ================= RETURN =================

  return {
    // State
    openingType,
    boxType,
    rType,
    openingTypeErrors,
    boxTypeErrors,
    rTypeErrors,
    isOpeningExpanded,
    isSelectExpanded,
    isCalculated,
    showResultsOp,
    calculatedOp,
    buttonLabel,
    toast,
    typeLabelMap,
    loading,

    // Actions
    setIsOpeningExpandedType,
    setIsSelectExpanded,
    handleOpeningTypeUpdate,
    handleBoxTypeUpdate,
    handleRTypeUpdate,
    handleCalculate,
    handleFinish,
    setToast,
    showToast,
  };
}
