import { useState } from "react";
import { useProjectStorage } from "./useProjectStorage";
import { validateWithYup } from "../utils";
import { CoverSchema } from "../schemas/cover/CoverSchema";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Default prefilled cover state — temporary auto-fill defaults
export const DEFAULT_COVER = {
  reportNumber: "WS76509-001",
  calculationNumber: "WS76509-001",
  title1: "江戸川フラワーガーデン",
  projectName: "江戸川フラワーガーデン",
  title2: "強度検討",
  coverTopText: "強度検討",
  title3: "",
  coverBottomText: "",
  region: "A",
  author: "X",
  responsibleDepartment: "S",
  date: new Date().toISOString().split("T")[0],
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Manages report cover form state and validation — used by the Report
// Cover modal shown at the end of the calculation flow.
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

  // Validates cover form against CoverSchema (for final report cover)
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
