import { validateWithYup } from "../../utils/validation";
import { ConditionSchema } from "../../schemas/initial-setup/ConditionSchema";

// Validates condition form — passes projectType as yup context
// so poleType validation only fires for lighting-pole
export async function validateCondition(condition, projectType) {
  const { isValid, errors } = await validateWithYup(
    ConditionSchema,
    condition,
    { context: { projectType } }, // ← pass ke yup context
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Initial Input.",
    };
  }

  return { isValid: true };
}
