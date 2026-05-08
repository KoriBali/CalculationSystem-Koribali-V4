import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import { validateWithYup } from "../utils/validation";
import { CoverSchema } from "../schemas/cover/CoverSchema";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Default empty cover state
const DEFAULT_COVER = {
  managementMark: "",
  calculationNumber: "",
  projectName: "",
  contentr2: "",
  contentr3: "",
  date: "",
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages cover form state, validation, and popup visibility
export function useCoverForm(projectType) {
  const [cover, setCover] = useProjectStorage(
    projectType,
    "cover",
    DEFAULT_COVER,
  );

  const [coverErrors, setCoverErrors] = useState({});
  const [showCoverPopup, setShowCoverPopup] = useState(false);

  // Updates cover fields — clears related errors as user types
  const updateCover = (updates) => {
    setCover((prev) => ({ ...prev, ...updates }));
    setCoverErrors((prev) => {
      const cleared = { ...prev };
      Object.keys(updates).forEach((key) => delete cleared[key]);
      return cleared;
    });
  };

  // Validates cover form against CoverSchema — updates error state
  const validate = async () => {
    const result = await validateWithYup(CoverSchema, cover);
    setCoverErrors(result.errors || {});
    return result.isValid;
  };

  // Opens cover popup modal
  const openCoverPopup = () => setShowCoverPopup(true);

  // Closes cover popup modal
  const closeCoverPopup = () => setShowCoverPopup(false);

  return {
    coverData: cover, // current cover field values
    coverErrors, // validation errors per field
    showCoverPopup, // controls modal visibility

    updateCover, // fn — updates fields + clears errors
    validate, // fn — validates against CoverSchema
    openCoverPopup, // fn — opens the modal
    closeCoverPopup, // fn — closes the modal
    setCoverErrors, // fn — manually set errors if needed
  };
}
