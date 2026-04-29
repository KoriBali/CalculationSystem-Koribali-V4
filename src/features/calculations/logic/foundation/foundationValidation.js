import { validateWithYup } from "../../utils/validation";
import { FoundationTypeSchema } from "../../schemas/foundation/FoundationTypeSchema";
import { SquareCaissonTypeSchema } from "../../schemas/foundation/SquareCaissonTypeSchema";
import { RoundCaissonTypeSchema } from "../../schemas/foundation/RoundCaissonTypeSchema";

// Validate all foundation inputs (type + specific detail)
export async function validateFoundation({
  foundationType,
  squareCaisson,
  roundCaisson,
}) {
  // Validate the main foundation type first
  const { isValid: isTypeValid, errors: typeErrors } = await validateWithYup(
    FoundationTypeSchema,
    foundationType,
  );

  // Return early if foundation type is invalid
  if (!isTypeValid) {
    return {
      isValid: false,
      typeErrors,
      message: "Please select the foundation type first.",
    };
  }

  // Validate Square Caisson Type fields when selected type is "square-caisson"
  if (foundationType.type === "square-caisson") {
    const { isValid, errors } = await validateWithYup(
      SquareCaissonTypeSchema,
      squareCaisson,
    );

    // Return early if Square Caisson Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        squareCaissonErrors: errors,
        message:
          "Please correct the errors Square Caisson Type Specifications fields.",
      };
    }
  }

  // Validate Round Caisson Type fields when selected type is "round-caisson"
  if (foundationType.type === "round-caisson") {
    const { isValid, errors } = await validateWithYup(
      RoundCaissonTypeSchema,
      roundCaisson,
    );

    // Return early if Round Caisson Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        roundCaissonErrors: errors,
        message:
          "Please correct the errors Round Caisson Type Specifications fields.",
      };
    }
  }

  // Return success when all validations pass
  return { isValid: true };
}
