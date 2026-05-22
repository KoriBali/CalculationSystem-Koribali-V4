// Available stepped pole standard option
export const STEPPED_POLE_OPTIONS = [
  { id: "steppedPole", label: "Stepped Pole" },
];

// Lower pole diameter groups — used as first selection step
export const COMBINATION_GROUPS = ["114.3", "139.8", "165.2"];

// Available combinations per diameter group (diameter-height format)
export const COMBINATIONS = {
  114.3: ["40-10", "40-12", "40-14", "40-20", "40-24", "40-30"],
  139.8: [
    "50-10",
    "50-12",
    "50-14",
    "50-20",
    "50-24",
    "50-30",
    "50-34",
    "50-40",
  ],
  165.2: ["60-14", "60-20", "60-24", "60-30", "60-34", "60-40", "60-50"],
};

// Lower pole thickness options keyed by lower pole diameter
export const TPL_MAP = {
  40: [3.5, 4.5, 6.0],
  50: [3.5, 4.5, 6.6],
  60: [3.7, 4.5, 5.0, 7.1],
};

// Ground position options — determines installation depth input visibility
export const GROUND_POSITION_OPTIONS = [
  { id: "onGL", label: "On GL" },
  { id: "upperGL", label: "Upper GL" }, 
  { id: "underGL", label: "Under GL" },
];
