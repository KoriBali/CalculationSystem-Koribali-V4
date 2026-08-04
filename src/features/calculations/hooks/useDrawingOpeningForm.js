import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";
import * as Yup from "yup";
import { validateWithYup } from "../utils/validation";

const DrawingOpeningSchema = Yup.object().shape({
  height: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Height is required")
    .positive("Height must be positive"),
  direction: Yup.string()
    .required("Opening direction is required")
    .oneOf(["left", "front", "right", "back"], "Invalid direction"),
  type: Yup.string()
    .required("Opening type is required")
    .oneOf(["box", "r"], "Invalid type"),
});

const getDefaultOpening = () => ({
  type: "",
  height: "",
  direction: "",
});

export function useDrawingOpeningForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [opening, setOpening] = useProjectStorage(
    projectType,
    "drawing_opening",
    getDefaultOpening()
  );

  const [localOpening, setLocalOpening] = useState(opening);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newOpening = { ...localOpening, ...updates };
    setLocalOpening(newOpening);
    setOpening(newOpening);
    
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptyOpening = getDefaultOpening();
    setLocalOpening(emptyOpening);
    setOpening(emptyOpening);
    setErrors({});
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingOpeningSchema,
      localOpening
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in Opening Input." });
      return null;
    }
    
    sessionStorage.setItem(`${projectType}_drawing_opening_completed`, "true");
    
    // Check if baseplate is enabled
    const rawGeneral = sessionStorage.getItem(`${projectType}_drawing_general`);
    const general = rawGeneral ? JSON.parse(rawGeneral) : null;
    const isBaseplateEnabled = general?.additionalComponents?.baseplate === true;
    
    if (isBaseplateEnabled) return "GO_BASEPLATE";

    // Check if coupling was used in general
    const isCouplingUsed = sessionStorage.getItem(`${projectType}_drawing_coupling_confirmed`) === "true";
    return isCouplingUsed ? "GO_COUPLING" : "GO_SURFACE";
  };

  return {
    projectType,
    localOpening,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
  };
}
