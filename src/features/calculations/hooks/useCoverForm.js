import { useState } from "react";
import { useProjectStorage } from "../../hooks/useProjectStorage";
import * as Utils from "../utils";
import { CoverSchema } from "../../schemas/CoverSchema";

// Custom hook to manage cover form state, validation, and UI behavior
export function useCoverForm(projectType) {
  // Initialize cover state with default values using project storage
  const [cover, setCover] = useProjectStorage(projectType, "cover", {
    managementMark: "",
    calculationNumber: "",
    projectName: "",
    contentr2: "",
    contentr3: "",
    date: "",
  });

  // State to store validation errors
  const [coverErrors, setCoverErrors] = useState({});

  // State to control cover popup visibility
  const [showCoverPopup, setShowCoverPopup] = useState(false);

  // Update cover fields and clear related errors for better UX
  const handleCoverUpdate = (updates) => {
    Utils.updateCover(cover, updates, setCover);
  };

  // Validate cover form using Yup schema as a single source of truth
  const validateCover = async () => {
    const result = await Utils.validateWithYup(CoverSchema, cover);

    // Update error state based on validation result
    setCoverErrors(result.errors || {});
    return result.isValid;
  };

  // Open cover popup modal
  const handleOpenCoverPopup = () => setShowCoverPopup(true);

  // Close cover popup modal
  const handleCloseCoverPopup = () => setShowCoverPopup(false);

  // Expose state and handlers for component usage
  return {
    cover,
    coverErrors,
    showCoverPopup,
    handleCoverUpdate,
    handleOpenCoverPopup,
    handleCloseCoverPopup,
    validateCover,
    setCoverErrors,
  };
}
