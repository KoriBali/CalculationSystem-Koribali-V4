import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateWithYup } from "../utils/validation";
import { DrawingSchema } from "../schemas/drawing/DrawingSchema";
import { useProjectStorage } from "./useProjectStorage";

const getDefaultDrawing = () => ({
  drawingType: "",
  surfaceTreatment: "",
  coatingType: "",
});

export function useDrawingForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [drawing, setDrawing] = useProjectStorage(
    projectType,
    "drawing",
    getDefaultDrawing()
  );

  const [localDrawing, setLocalDrawing] = useState(drawing);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newDrawing = { ...localDrawing, ...updates };
    setLocalDrawing(newDrawing);
    setDrawing(newDrawing); // Sync to localStorage immediately so "Save Draft" works
    
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptyDrawing = getDefaultDrawing();
    setLocalDrawing(emptyDrawing);
    setDrawing(emptyDrawing); // Reset localStorage as well
    setErrors({});
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingSchema,
      localDrawing
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in Drawing Input." });
      return;
    }
    
    // Allow the view to handle the next step (e.g. Finish Modal)
    return "OPEN_COVER";
  };

  return {
    projectType,
    localDrawing,
    errors,
    toast,
    setToast,
    setLocalDrawing,
    handleUpdate,
    handleReset,
    handleNext,
  };
}
