import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { validateCondition } from "../logic/initial-setup/conditionValidation";
import {
  applyStandardDefaults,
  getDisabledComponents,
  saveCalculationConfig,
  cleanupDisabledComponents,
} from "../logic/initial-setup/conditionLogic";
import { useProjectStorage } from "./useProjectStorage";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const getDefaultCondition = (projectType) => ({
  designStandard: "",
  designWindSpeed: "",
  designAirDensity: "",
  poleType: projectType === "lighting-pole" ? "" : "custom",
  openingEnabled: false,
  baseplateEnabled: false,
  foundationEnabled: false,
});

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useConditionForm() {
  const { type: projectType } = useParams();
  const navigate = useNavigate();

  // Persisted condition — auto sync ke sessionStorage via useProjectStorage
  const [condition, setCondition] = useProjectStorage(
    projectType,
    "condition",
    getDefaultCondition(projectType),
  );

  // Local draft — tidak langsung persist, hanya commit saat proceed
  const [localCondition, setLocalCondition] = useState(condition);
  const [prevCondition, setPrevCondition] = useState(condition);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDisable, setConfirmDisable] = useState(null);

  // Update local draft + auto-fill defaults + clear related errors
  const handleUpdate = (updates) => {
    const next = applyStandardDefaults(updates);
    setLocalCondition((prev) => ({ ...prev, ...next }));

    // ✅ Pakai `next` bukan `updates` — supaya key yang di-autofill juga ter-clear
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(next).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // Validate then proceed — or show confirm modal if components were disabled
  const handleNext = async () => {
    const validation = await validateCondition(localCondition, projectType);

    if (!validation.isValid) {
      setErrors(validation.errors); // ✅ Yup langsung set error yang benar
      setToast({ message: validation.message });
      return;
    }

    const disabled = getDisabledComponents(condition, localCondition);

    if (disabled.length > 0) {
      setPrevCondition(condition);
      setConfirmDisable(disabled);
      return;
    }

    proceed();
  };

  // Commit local draft to sessionStorage then navigate to next step
  const proceed = () => {
    // 1. Save config — determines which steps are visible in header nav
    saveCalculationConfig(projectType, localCondition);

    // 2. Cleanup sessionStorage for disabled components
    cleanupDisabledComponents(projectType, localCondition);

    // 3. Commit condition to sessionStorage
    setCondition(localCondition);

    // 4. Navigate to pole step
    navigate(`/calculation/${projectType}/pole`);
  };

  return {
    projectType,
    localCondition,
    errors,
    toast,
    confirmDisable,
    prevCondition,

    setToast,
    setConfirmDisable,
    setLocalCondition,

    handleUpdate,
    handleNext,
    proceed,
  };
}
