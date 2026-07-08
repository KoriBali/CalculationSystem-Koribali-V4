import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import { validateWithYup } from "../utils";
import { CoverSchema } from "../schemas/cover/CoverSchema";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Default empty cover state
const DEFAULT_COVER = {
  managementCode: "",
  calculationNumber: "",
  projectName: "",
  coverTopText: "",
  coverBottomText: "",
  date: "",
  withDrawing: false,
  withReport: false,
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

  return {
    coverData: cover, // current cover field values
    coverErrors, // validation errors per field

    updateCover, // fn — updates fields + clears errors
    validate, // fn — validates against CoverSchema
    setCoverErrors, // fn — manually set errors if needed
  };
}
