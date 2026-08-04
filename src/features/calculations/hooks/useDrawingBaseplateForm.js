import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";
import { DrawingBaseplateSchema } from "../schemas/drawing/DrawingBaseplateSchema";
import { validateWithYup } from "../utils/validation";

const getDefaultBaseplate = () => ({
  baseplateType: "",
  bpWidthEW: "",
});

export function useDrawingBaseplateForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [baseplate, setBaseplate] = useProjectStorage(
    projectType,
    "drawing_baseplate",
    getDefaultBaseplate()
  );

  const [localBaseplate, setLocalBaseplate] = useState(baseplate);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newBaseplate = { ...localBaseplate, ...updates };
    setLocalBaseplate(newBaseplate);
    setBaseplate(newBaseplate);
    
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptyBaseplate = getDefaultBaseplate();
    setLocalBaseplate(emptyBaseplate);
    setBaseplate(emptyBaseplate);
    setErrors({});
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingBaseplateSchema,
      localBaseplate
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in Baseplate Input." });
      return null;
    }
    
    sessionStorage.setItem(`${projectType}_drawing_baseplate_completed`, "true");
    
    // Check if coupling was used in general
    const isCouplingUsed = sessionStorage.getItem(`${projectType}_drawing_coupling_confirmed`) === "true";
    return isCouplingUsed ? "GO_COUPLING" : "GO_SURFACE";
  };

  return {
    projectType,
    localBaseplate,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
  };
}
