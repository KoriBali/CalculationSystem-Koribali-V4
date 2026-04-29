import { calculateBaseplate } from "../../services/baseplateService";

// Prepare payload and execute baseplate calculation API
export async function executeBaseplateCalculation({
  baseplateType,
  fourRibType,
  eightRibType,
}) {
  // Ensure baseplate type exists before processing
  if (!baseplateType?.type) {
    throw new Error("Baseplate type is required");
  }

  // Initialize base payload with baseplate type
  let payload = { baseplateType };

  // Extend payload based on selected baseplate type
  switch (baseplateType.type) {
    case "4rib":
      payload = { ...payload, ...fourRibType };
      break;

    case "8rib":
      payload = { ...payload, ...eightRibType };
      break;

    // Handle invalid or unsupported baseplate types
    default:
      throw new Error("Invalid baseplate type");
  }

  // Execute API call with prepared payload
  return await calculateBaseplate(payload);
}
