import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateWithYup } from "../utils/validation";
import { SurfaceSchema } from "../schemas/drawing/SurfaceSchema";
import { useProjectStorage } from "./useProjectStorage";

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
    setSurface(newSurface); // Sync to localStorage immediately so "Save Draft" works

    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptySurface = getDefaultSurface();
    setLocalSurface(emptySurface);
    setSurface(emptySurface); // Reset localStorage as well
    setErrors({});
  };

  const handleFinish = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      SurfaceSchema,
      localSurface
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in Surface Input." });
      return;
    }
    
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
