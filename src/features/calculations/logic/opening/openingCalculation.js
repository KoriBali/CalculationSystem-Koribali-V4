import { calculateOpening } from "../../services/openingService";

// Prepare payload and execute opening calculation API
export async function executeOpeningCalculation({
  openingType,
  boxType,
  rType,
}) {
  // Ensure opening type exists before processing
  if (!openingType?.type) {
    throw new Error("Opening type is required");
  }

  // Initialize base payload with opening type
  let payload = { openingType };

  // Extend payload based on selected opening type
  switch (openingType.type) {
    case "box":
      payload = { ...payload, ...boxType };
      break;

    case "r":
      payload = { ...payload, ...rType };
      break;

    // Handle invalid or unsupported opening types
    default:
      throw new Error("Invalid opening type");
  }

  // Execute API call with prepared payload
  return await calculateOpening(payload);
}
