// Available pole standard options — shown as selectable buttons in PoleStandardForm
export const POLE_STANDARD_OPTIONS = [
  { id: "IS", label: "Type-I (IS)" },
  { id: "LS", label: "Type-L (LS)" },
  { id: "TS", label: "Type-T (TS)" },
  { id: "IA", label: "Type-I (IA)" },
  { id: "LA", label: "Type-L (LA)" },
  { id: "TA", label: "Type-T (TA)" },
];

// Height options for S-series poles (IS, LS, TS, TA)
const HEIGHT_OPTIONS_S = {
  onGL: [
    { id: "8", label: "8.0" },
    { id: "10", label: "10.0" },
    { id: "12", label: "12.0" },
  ],
  underGL: [
    { id: "8U", label: "8.3" },
    { id: "10U", label: "10.3" },
    { id: "12U", label: "12.3" },
  ],
};

// Height options for A-series poles (IA, LA)
const HEIGHT_OPTIONS_A = {
  onGL: [
    { id: "4.5", label: "4.5" },
    { id: "5", label: "5.0" },
    { id: "8", label: "8.0" },
    { id: "10", label: "10.0" },
    { id: "12", label: "12.0" },
  ],
  underGL: [
    { id: "4.8", label: "4.8" },
    { id: "5.3", label: "5.3" },
    { id: "8.3", label: "8.3" },
    { id: "10.3", label: "10.3" },
    { id: "12.3", label: "12.3" },
  ],
};

// Maps each pole standard to its corresponding height options
export const HEIGHT_OPTIONS_BY_STANDARD = {
  IS: HEIGHT_OPTIONS_S,
  LS: HEIGHT_OPTIONS_S,
  TS: HEIGHT_OPTIONS_S,
  TA: HEIGHT_OPTIONS_S,
  LA: HEIGHT_OPTIONS_A,
  IA: HEIGHT_OPTIONS_A,
};

// Ground position options — determines which height list to use
export const GROUND_POSITION_OPTIONS = [
  { id: "onGL", label: "On GL" },
  { id: "underGL", label: "Under GL" },
];
