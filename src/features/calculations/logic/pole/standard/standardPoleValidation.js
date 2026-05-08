import { validateWithYup } from "../../../utils/validation";
import { PoleTypeSchema } from "../../../schemas/pole/standard/PoleTypeSchema";
import { StraightTypeSchema } from "../../../schemas/pole/standard/StraightTypeSchema";
import { TaperTypeSchema } from "../../../schemas/pole/standard/TaperTypeSchema";

// ─── POLE TYPE ────────────────────────────────────────────────────────────────

// Validates pole type selection (taper / straight)
export async function validatePoleType(poleTypeStandard) {
  const { isValid, errors } = await validateWithYup(
    PoleTypeSchema,
    poleTypeStandard,
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please select the pole type first.",
    };
  }

  return { isValid: true };
}

// ─── STRAIGHT (STEPPED) POLE ──────────────────────────────────────────────────

// Validates straight (stepped) pole standard fields
// condition affects which fields are required (e.g. baseplateEnabled)
export async function validateStraightPole(straightPoleStandard, condition) {
  const { isValid, errors } = await validateWithYup(
    StraightTypeSchema,
    straightPoleStandard,
    { context: { condition } },
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message:
        "Please correct the errors in Stepped Pole Type Specification fields.",
    };
  }

  return { isValid: true };
}

// ─── TAPER POLE ───────────────────────────────────────────────────────────────

// Validates taper pole standard fields (poleType, groundPosition, height)
export async function validateTaperPole(taperPoleStandard) {
  const { isValid, errors } = await validateWithYup(
    TaperTypeSchema,
    taperPoleStandard,
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Taper Pole fields.",
    };
  }

  return { isValid: true };
}
