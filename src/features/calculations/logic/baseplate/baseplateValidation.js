import { validateWithYup } from "../../utils";
import { BaseplateTypeSchema } from "../../schemas/baseplate/BaseplateTypeSchema";
import { FourRibTypeSchema } from "../../schemas/baseplate/FourRibTypeSchema";
import { EightRibTypeSchema } from "../../schemas/baseplate/EightRibTypeSchema ";

// Validate all baseplate inputs (type + specific detail)
export async function validateBaseplate({
  baseplateType,
  fourRibType,
  eightRibType,
}) {
  // Validate the main baseplate type first
  const { isValid: isTypeValid, errors: typeErrors } = await validateWithYup(
    BaseplateTypeSchema,
    baseplateType,
  );

  // Return early if baseplate type is invalid
  if (!isTypeValid) {
    return {
      isValid: false,
      typeErrors,
      message: "Please select the baseplate type first.",
    };
  }

  // Validate 4 Rib Type fields when selected type is "4rib"
  if (baseplateType.type === "4rib") {
    const { isValid, errors } = await validateWithYup(
      FourRibTypeSchema,
      fourRibType,
    );

    // Return early if 4 Rib Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        fourRibTypeErrors: errors,
        message: "Please correct the errors 4 Rib Type Specifications fields.",
      };
    }
  }

  // Validate 8 Rib Type fields when selected type is "8rib"
  if (baseplateType.type === "8rib") {
    const { isValid, errors } = await validateWithYup(
      EightRibTypeSchema,
      eightRibType,
    );

    // Return early if 8 Rib Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        eightRibTypeErrors: errors,
        message: "Please correct the errors 8 Rib Type Specifications fields.",
      };
    }
  }

  // Return success when all validations pass
  return { isValid: true };
}
