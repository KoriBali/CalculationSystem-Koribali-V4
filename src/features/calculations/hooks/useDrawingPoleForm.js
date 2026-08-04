import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateWithYup } from "../utils/validation";
import { DrawingPoleSchema } from "../schemas/drawing/DrawingPoleSchema";
import { useProjectStorage } from "./useProjectStorage";

const getDefaultPole = () => ({
  taperPoleStandard: { poleType: "", groundPosition: "", height: "" },
});

export function useDrawingPoleForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  const [pole, setPole] = useProjectStorage(
    projectType,
    "drawing_pole",
    getDefaultPole()
  );

  const [localPole, setLocalPole] = useState(pole);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleUpdate = (updates) => {
    const newPole = { ...localPole, ...updates };
    setLocalPole(newPole);
    setPole(newPole);
    
    setErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleReset = () => {
    const emptyPole = getDefaultPole();
    setLocalPole(emptyPole);
    setPole(emptyPole);
    setErrors({});
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingPoleSchema,
      localPole
    );

    if (!isValid) {
      setErrors(validationErrors);
      setToast({ message: "Please correct the errors in Pole Input." });
      return null;
    }
    
    sessionStorage.setItem(`${projectType}_drawing_pole_completed`, "true");
    
    // Check if opening was used in general
    const isOpeningUsed = general?.additionalComponents?.opening === true;
    if (isOpeningUsed) return "GO_OPENING";

    const isBaseplateEnabled = general?.additionalComponents?.baseplate === true;
    if (isBaseplateEnabled) return "GO_BASEPLATE";

    // Check if coupling was used in general
    const isCouplingUsed = sessionStorage.getItem(`${projectType}_drawing_coupling_confirmed`) === "true";
    return isCouplingUsed ? "GO_COUPLING" : "GO_SURFACE";
  };

  const [general] = useProjectStorage(projectType, "drawing_general", {});
  const isBaseplate = general?.additionalComponents?.baseplate === true;

  return {
    projectType,
    localPole,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
    isBaseplate,
  };
}
