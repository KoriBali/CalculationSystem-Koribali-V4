import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStorage } from "../../../hooks/useProjectStorage";

import { validateBaseplate } from "../logic/baseplate/baseplateValidation";
import { executeBaseplateCalculation } from "../logic/baseplate/baseplateCalculation";

import * as Utils from "../../../utils/pole-analyzer";

// Main custom hook to manage baseplate form state and workflow
export function useBaseplateForm() {
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

  // Baseplate type state (4 rib / 8 rib)
  const [baseplateType, setBaseplateType] = useProjectStorage(
    projectType,
    "baseplateType",
    {
      type: "",
    },
  );

  // 4 Rib type input state
  const [fourRibType, setFourRibType] = useProjectStorage(
    projectType,
    "fourRibType",
    {
      bpWidthEW: "",
      bpWidthNS: "",
      anchorPitchEW: "",
      anchorPitchNS: "",
      anchorDia: "",
      anchorCount: "",
      anchorCountTension: "",
      bpThickness: "",
      ribHeight: "",
      ribScallop: "",
      weldLeg: "",
      ribLength: "",
      ribThickness: "",
    },
  );

  // 8 Rib type input state
  const [eightRibType, setEightRibType] = useProjectStorage(
    projectType,
    "eightRibType",
    {
      bpWidthEW: "",
      bpWidthNS: "",
      anchorPitchEW: "",
      anchorPitchNS: "",
      anchorDia: "",
      anchorCount: "",
      anchorCountTension: "",
      ribAngle: "",
      bpThickness: "",
      ribHeight: "",
      ribScallop: "",
      weldLeg: "",
      ribLength: "",
      ribThickness: "",
    },
  );

  // Calculated result state
  const [calculatedBaseplate, setCalculatedBaseplate] = useProjectStorage(
    projectType,
    "calculatedBaseplate",
    null,
  );

  // Toggle to show/hide results
  const [showResultsBaseplate, setShowResultsBaseplate] = useProjectStorage(
    projectType,
    "showResultsBaseplate",
    false,
  );

  // Validation error states for each section
  const [baseplateTypeErrors, setBaseplateTypeErrors] = useState({});
  const [fourRibTypeErrors, setFourRibTypeErrors] = useState({});
  const [eightRibTypeErrors, setEightRibTypeErrors] = useState({});

  // UI expand/collapse states
  const [isBaseplateExpanded, setIsBaseplateExpanded] = useState(true);
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
    "baseplate",
  );

  // ================= HANDLERS =================

  // Update baseplate type
  const handleBaseplateTypeUpdate = (updates) => {
    Utils.updateBaseplateType(baseplateType, updates, setBaseplateType);
  };

  // Update 4 Rib Type inputs and clear related errors
  const handleFourRibTypeUpdate = (updates) => {
    Utils.updateFourRibType(fourRibType, updates, setFourRibType);
  };

  // Update 8 Rib Type inputs and clear related errors
  const handleEightRibTypeUpdate = (updates) => {
    Utils.updateEightRibType(eightRibType, updates, setEightRibType);
  };

  // Handle calculation flow (validation + API call)
  const handleCalculate = async () => {
    // Reset all error states before validation
    setBaseplateTypeErrors({});
    setFourRibTypeErrors({});
    setEightRibTypeErrors({});

    // Run validation logic
    const validation = await validateBaseplate({
      baseplateType,
      fourRibType,
      eightRibType,
    });

    // Handle validation failure
    if (!validation.isValid) {
      setBaseplateTypeErrors(validation.typeErrors || {});
      setFourRibTypeErrors(validation.fourRibTypeErrors || {});
      setEightRibTypeErrors(validation.eightRibTypeErrors || {});
      showToast(validation.message);
      return;
    }

    try {
      // Start loading state
      setLoading(true);

      // Execute API calculation
      const data = await executeBaseplateCalculation({
        baseplateType,
        fourRibType,
        eightRibType,
      });

      // Save calculated result
      setCalculatedBaseplate({
        ...data,
        baseplateType,
      });

      // Update UI state after success
      setIsCalculated(true);
      setShowResultsBaseplate(true);
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
    "4rib": "4 Rib Type",
    "8rib": "8 Rib Type",
  };

  // ================= RETURN =================

  return {
    // State
    baseplateType,
    fourRibType,
    eightRibType,
    baseplateTypeErrors,
    fourRibTypeErrors,
    eightRibTypeErrors,
    isBaseplateExpanded,
    isSelectExpanded,
    isCalculated,
    showResultBaseplate,
    calculatedBaseplate,
    buttonLabel,
    toast,
    typeLabelMap,
    loading,

    // Actions
    setIsBaseplateExpanded,
    setIsSelectExpanded,
    handleBaseplateTypeUpdate,
    handleFourRibTypeUpdate,
    handleEightRibTypeUpdate,
    handleCalculate,
    handleFinish,
    setToast,
    showToast,
  };
}
