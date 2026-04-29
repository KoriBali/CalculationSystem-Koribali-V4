import { calculateFoundation } from "../../services/foundationService";

// Prepare payload and execute foundation calculation API
export async function executeFoundationCalculation({
  foundationType,
  squareCaisson,
  roundCaisson,
}) {
  // Ensure foundation type exists before processing
  if (!foundationType?.type) {
    throw new Error("Foundation type is required");
  }

  // Initialize base payload with foundation type
  let payload = { foundationType };

  // Extend payload based on selected foundation type
  switch (foundationType.type) {
    case "square-caisson":
      payload = { ...payload, ...squareCaisson };
      break;

    case "round-caisson":
      payload = { ...payload, ...roundCaisson };
      break;

    // Handle invalid or unsupported foundation types
    default:
      throw new Error("Invalid foundation type");
  }

  // Execute API call with prepared payload
  return await calculateFoundation(payload);
}
