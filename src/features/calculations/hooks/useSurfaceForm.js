import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateWithYup } from "../utils/validation";
import { SurfaceSchema } from "../schemas/drawing/SurfaceSchema";
import { useProjectStorage } from "./useProjectStorage";
import { scrollToFirstError, firstErrorMessage } from "../utils/scrollToError";

const FIELD_LABELS = {
  surfaceTreatmentType: "Pole Surface Treatment Option",
  platingType: "Plating Type",
  specificPlatingTypeCode: "Specific Plating Type Code",
  paintingType: "Painting Type",
  colorName: "Color Name",
  munsellValue: "Munsell Value",
  colorCode: "Color Code",
};

const getDefaultSurface = () => ({
  surfaceTreatmentType: "Plating Only",
  platingType: "",
  specificPlatingTypeCode: "",
  paintingType: "",
  colorName: "",
  munsellValue: "",
  colorCode: "",
});

export function useSurfaceForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [surface, setSurface] = useProjectStorage(
    projectType,
    "drawing",
    getDefaultSurface()
  );

  const [localSurface, setLocalSurface] = useState(surface);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newSurface = { ...localSurface, ...updates };
    setLocalSurface(newSurface);
    setSurface(newSurface);

    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptySurface = getDefaultSurface();
    setLocalSurface(emptySurface);
    setSurface(emptySurface);
    setErrors({});
  };

  const handleFinish = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      SurfaceSchema,
      localSurface
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: firstErrorMessage(validationErrors, FIELD_LABELS) });
      scrollToFirstError(validationErrors);
      return;
    }
    
    setSurface(localSurface);
    sessionStorage.setItem(`${projectType}_drawing_completed`, "true");
    
    // Allow the view to handle the next step (e.g. Finish Modal)
    return "OPEN_FINISH";
  };

  return {
    projectType,
    localSurface,
    errors,
    toast,
    setToast,
    setLocalSurface,
    handleUpdate,
    handleReset,
    handleFinish,
  };
}
