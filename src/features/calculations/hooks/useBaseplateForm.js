import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import { validateBaseplate } from "../logic/baseplate/baseplateValidation";
import { executeBaseplateCalculation } from "../logic/baseplate/baseplateCalculation";
import { scrollToFirstError, firstErrorMessage } from "../utils/scrollToError";

import * as Utils from "../utils";

// Main custom hook to manage baseplate form state and workflow
export function useBaseplateForm() {
  const { type: projectType, draftId } = useParams();
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

  // Validation error states for each section  // ── UI state ──

  const [baseplateTypeErrors, setBaseplateTypeErrors] = useState({});
  const [fourRibTypeErrors, setFourRibTypeErrors] = useState({});
  const [eightRibTypeErrors, setEightRibTypeErrors] = useState({});
  const [isBaseplateExpanded, setIsBaseplateExpanded] = useState(true);
  const [isSelectExpanded, setIsSelectExpanded] = useState(true);

  // Loading and calculation status
  const [loading, setLoading] = useState(false);
  const isCalculated = !!calculatedBaseplate;

  // Toast notification state
  const [toast, setToast] = useState(null);

  // ── Navigation ──

  // Determines button label, next step path, and whether this is the last step
  const { buttonLabel, nextStep, prevStep, isLast } = Utils.getStepNavigation(
    condition,
    "baseplate",
    workflow.withReport
  );

  // ── Helpers ──

  // Displays a toast notification
  const showToast = (message, type = "error") => setToast({ message, type });

  // ── Update handlers ──

  const handleBaseplateTypeUpdate = (updates) => {
    Utils.updateBaseplateType(baseplateType, updates, setBaseplateType);
    setBaseplateTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleFourRibTypeUpdate = (updates) => {
    Utils.updateFourRibType(fourRibType, updates, setFourRibType);
    setFourRibTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleEightRibTypeUpdate = (updates) => {
    Utils.updateEightRibType(eightRibType, updates, setEightRibType);
    setEightRibTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // ── Calculation ──

  // Validates inputs then calls the baseplate calculation API
  const handleCalculate = async () => {
    // Reset any previous errors
    setBaseplateTypeErrors({});
    setFourRibTypeErrors({});
    setEightRibTypeErrors({});

    const validation = await validateBaseplate({
      baseplateType,
      fourRibType,
      eightRibType,
    });

    if (!validation.isValid) {
      setBaseplateTypeErrors(validation.typeErrors || {});
      setFourRibTypeErrors(validation.fourRibTypeErrors || {});
      setEightRibTypeErrors(validation.eightRibTypeErrors || {});
      
      const firstErrors =
        validation.typeErrors || validation.fourRibTypeErrors || validation.eightRibTypeErrors || {};
      showToast(firstErrorMessage(firstErrors) || validation.message);
      scrollToFirstError(firstErrors);
      return;
    }

    try {
      setLoading(true);

      const data = await executeBaseplateCalculation({
        baseplateType,
        fourRibType,
        eightRibType,
      });

      // Persist result alongside its baseplate type for the result table
      setCalculatedBaseplate({ ...data, baseplateType });

      // Update UI state after success
      setShowResultsBaseplate(true);
    } catch (err) {
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

    navigate(`/calculation/${projectType}/${draftId}/${nextStep}`);
  };

  // Navigates back to the previous step (pole, or opening if enabled)
  const handleBack = () => {
    navigate(`/calculation/${projectType}/${draftId}/${prevStep}`);
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
    showResultsBaseplate, // PERBAIKAN: Sinkronisasi nama (tambah s) agar sesuai dengan state dan view
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
    handleBack,
    setToast,
    showToast,
  };
}
