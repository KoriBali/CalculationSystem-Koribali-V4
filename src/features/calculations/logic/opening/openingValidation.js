import { validateWithYup } from "../../utils";
import { OpeningTypeSchema } from "../../schemas/opening/OpeningTypeSchema";
import { BoxTypeSchema } from "../../schemas/opening/BoxTypeSchema";
import { RTypeSchema } from "../../schemas/opening/RTypeSchema";

// Validate all opening inputs (type + specific detail)
// `isCalculationAndDrawing` — true when this project also produces a
// drawing (projectMode "both"), so Opening Direction becomes required.
export async function validateOpening({
  openingType,
  boxType,
  rType,
  isCalculationAndDrawing = false,
}) {
  // Validate the main opening type first
  const { isValid: isTypeValid, errors: typeErrors } = await validateWithYup(
    OpeningTypeSchema,
    openingType,
  );

  // Return early if opening type is invalid
  if (!isTypeValid) {
    return {
      isValid: false,
      typeErrors,
      message: "Please select the opening type first.",
    };
  }

  // Validate Box Type fields when selected type is "box"
  if (openingType.type === "box") {
    const { isValid, errors } = await validateWithYup(
      BoxTypeSchema(isCalculationAndDrawing),
      boxType,
    );

    // Return early if Box Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        boxErrors: errors,
        message: "Please correct the errors Box Type Specifications fields.",
      };
    }
  }

  // Validate R Type fields when selected type is "r"
  if (openingType.type === "r") {
    const { isValid, errors } = await validateWithYup(
      RTypeSchema(isCalculationAndDrawing),
      rType,
    );

    // Return early if R Type validation fails
    if (!isValid) {
      return {
        isValid: false,
        rErrors: errors,
        message: "Please correct the errors R Type Specifications fields.",
      };
    }
  }

  // Return success when all validations pass
  return { isValid: true };
}
