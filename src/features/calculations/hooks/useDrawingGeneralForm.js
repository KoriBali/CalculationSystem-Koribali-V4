import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateWithYup } from "../utils/validation";
import { DrawingGeneralSchema } from "../schemas/drawing/DrawingGeneralSchema";
import { useProjectStorage } from "./useProjectStorage";

const getDefaultGeneral = () => ({
  drawingType: "",
  drawingNumber: "",
  partNumber: "",
  designerName: "",
  checkedByName: "",
  approvedByName: "",
  openingDirection: "",
  lightingCompanyName: "",
  poleType: "",
  additionalComponents: {
    opening: false,
    baseplate: false,
    foundation: false,
  },
  useCoupling: null,
});

export function useDrawingGeneralForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [general, setGeneral] = useProjectStorage(
    projectType,
    "drawing_general",
    getDefaultGeneral()
  );

  const workflowRaw = sessionStorage.getItem(`${projectType}_workflow`);
  const workflow = workflowRaw ? JSON.parse(workflowRaw) : {};
  const projectMode = workflow.projectMode || "calculation";

  const [localGeneral, setLocalGeneral] = useState(general);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newGeneral = { ...localGeneral, ...updates };
    setLocalGeneral(newGeneral);
    setGeneral(newGeneral); // Sync to sessionStorage immediately
    
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptyGeneral = getDefaultGeneral();
    setLocalGeneral(emptyGeneral);
    setGeneral(emptyGeneral);
    setErrors({});
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingGeneralSchema,
      localGeneral,
      { context: { projectMode } }
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in General Input." });
      return null;
    }
    
    // Set drawing completed to show other tabs
    sessionStorage.setItem(`${projectType}_drawing_completed`, "true");
    
    // Explicitly save the user's coupling choice here so the navigation header only updates after "Next Step"
    sessionStorage.setItem(`${projectType}_drawing_coupling_confirmed`, String(localGeneral.useCoupling));
    
    if (workflow.projectMode === "drawing") {
      return "GO_POLE";
    }
    
    return localGeneral.useCoupling ? "GO_COUPLING" : "GO_SURFACE";
  };

  return {
    projectType,
    localGeneral,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
    projectMode,
  };
}
