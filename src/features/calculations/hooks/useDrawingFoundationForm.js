import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";
import { DrawingFoundationSchema } from "../schemas/drawing/DrawingFoundationSchema";
import { validateWithYup } from "../utils/validation";

import * as Utils from "../utils";

export function useDrawingFoundationForm() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  // State for Drawing Foundation Type
  const [foundationType, setFoundationType] = useProjectStorage(
    projectType,
    "drawing_foundation_type",
    { type: "" }
  );

  // Square Caisson type input state
  const [squareCaisson, setSquareCaisson] = useProjectStorage(
    projectType,
    "drawing_square_caisson",
    {
      foundationWidthX: "",
      foundationWidthY: "",
      embedmentDepth: "",
      nValue: "",
      yValue: "",
      ycValue: "",
      alphaValue: "",
    }
  );

  // Round Caisson type input state
  const [roundCaisson, setRoundCaisson] = useProjectStorage(
    projectType,
    "drawing_round_caisson",
    {
      foundationWidthX: "",
      foundationWidthY: "",
      embedmentDepth: "",
      nValue: "",
      yValue: "",
      ycValue: "",
      alphaValue: "",
    }
  );

  const [foundationTypeErrors, setFoundationTypeErrors] = useState({});
  const [squareCaissonErrors, setSquareCaissonErrors] = useState({});
  const [roundCaissonErrors, setRoundCaissonErrors] = useState({});

  const [isFoundationExpanded, setIsFoundationExpanded] = useState(true);
  const [isSelectExpanded, setIsSelectExpanded] = useState(true);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const handleFoundationTypeUpdate = (updates) => {
    Utils.updateFoundationType(foundationType, updates, setFoundationType);
    setFoundationTypeErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleSquareCaissonUpdate = (updates) => {
    Utils.updateSquareCaisson(squareCaisson, updates, setSquareCaisson);
    setSquareCaissonErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleRoundCaissonUpdate = (updates) => {
    Utils.updateRoundCaisson(roundCaisson, updates, setRoundCaisson);
    setRoundCaissonErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      DrawingFoundationSchema,
      { foundationType, squareCaisson, roundCaisson }
    );

    if (!isValid) {
      if (validationErrors["foundationType.type"]) {
        setFoundationTypeErrors({ type: validationErrors["foundationType.type"] });
      }
      
      const sqErrors = {};
      const rdErrors = {};
      Object.keys(validationErrors).forEach((key) => {
        if (key.startsWith("squareCaisson.")) {
          sqErrors[key.replace("squareCaisson.", "")] = validationErrors[key];
        }
        if (key.startsWith("roundCaisson.")) {
          rdErrors[key.replace("roundCaisson.", "")] = validationErrors[key];
        }
      });
      
      setSquareCaissonErrors(sqErrors);
      setRoundCaissonErrors(rdErrors);

      showToast("Please correct the errors in Foundation Input.");
      return null;
    }

    sessionStorage.setItem(`${projectType}_drawing_foundation_completed`, "true");
    
    // In drawing mode, Foundation is the last possible step before general or whatever, but actually
    // the tab order in Drawing Only is: General -> Pole -> Opening -> Baseplate -> Foundation -> Coupling -> Surface
    // Wait, let's check tab order. I will look at HeaderCalculationPage.
    
    // For now we just return the string. We will handle navigation in the View.
    return "SUCCESS";
  };

  const typeLabelMap = {
    "square-caisson": "Square Caisson Type",
    "round-caisson": "Round Caisson Type",
  };

  return {
    foundationType,
    squareCaisson,
    roundCaisson,
    foundationTypeErrors,
    squareCaissonErrors,
    roundCaissonErrors,
    isFoundationExpanded,
    setIsFoundationExpanded,
    isSelectExpanded,
    setIsSelectExpanded,
    toast,
    setToast,
    showToast,
    handleFoundationTypeUpdate,
    handleSquareCaissonUpdate,
    handleRoundCaissonUpdate,
    handleNext,
    typeLabelMap,
  };
}
