// Ground position options — determines installation depth input visibility.
// Not sourced from the API: /api/master/pole-standards has no groundPosition
// field, this is purely a local UI concept.
export const GROUND_POSITION_OPTIONS = [
  { id: "onGL", label: "On GL" },
  { id: "upperGL", label: "Upper GL" },
  { id: "underGL", label: "Under GL" },
];
