import { validateWithYup } from "../../utils/validation";
import { ConditionSchema } from "../../schemas/initial-setup/ConditionSchema";

// Validate all foundation inputs
export async function validateCondition(condition) {
  // Validate Condition Form
  const { isValid, errors } = await validateWithYup(ConditionSchema, condition);

  // Return
  if (!isValid) {
    return {
      isValid: false,
      conditionErrors: errors,
      message: "Please correct the errors in Initial Input.",
    };
  }
  return { isValid: true };
}
