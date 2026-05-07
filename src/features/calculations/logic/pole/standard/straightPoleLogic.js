import { TPL_MAP } from "../../../constants/straightPoleStandardOptions";

// Returns upper pole thickness options based on upper pole height
export function getUpperThicknessOptions(height) {
  if (height === 10) return [2.3, 3.2];
  if (height === 12 || height === 14) return [3.2, 3.5];
  if (height === 20) return [3.2, 3.8];
  if (height === 24 || height === 30) return [2.8, 3.2, 4.2];
  if (height === 34) return [3.2, 4.2];
  if (height === 40) return [3.5, 4.5, 6.0];
  if (height === 50) return [3.5, 4.5, 6.6];
  return [];
}

// Derives upper and lower thickness options from selected combination (e.g. "40-10")
export function getThicknessOptions(combination) {
  if (!combination) return { upper: [], lower: [] };

  const [diameter, height] = combination.split("-").map(Number);

  return {
    upper: getUpperThicknessOptions(height),
    lower: TPL_MAP[diameter] || [],
  };
}
