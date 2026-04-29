import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { validateCondition } from "../logic/initial-setup/conditionValidation";
import {
  applyStandardDefaults,
  getDisabledComponents,
} from "../logic/initial-setup/conditionLogic";

import useConditionStore from "../store/useConditionStore";

export function useConditionForm() {
  const { type: projectType } = useParams();
  const navigate = useNavigate();

  const { condition, setCondition } = useConditionStore();

  const [localCondition, setLocalCondition] = useState(condition);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDisable, setConfirmDisable] = useState(null);
  const [prevCondition, setPrevCondition] = useState(condition);

  const handleUpdate = (updates) => {
    let next = applyStandardDefaults(updates);

    setLocalCondition((prev) => ({
      ...prev,
      ...next,
    }));
  };

  const handleNext = async () => {
    setErrors({});

    const validation = await validateCondition(localCondition);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setToast(validation.message);
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

  const proceed = () => {
    setCondition(localCondition); // 🔥 global state
    navigate(`/calculation/${projectType}/pole`);
  };

  return {
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
