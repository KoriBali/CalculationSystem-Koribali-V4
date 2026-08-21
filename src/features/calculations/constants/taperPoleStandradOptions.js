// Ground position options — determines which height list to use.
// Not sourced from the API: /api/master/pole-standards has no groundPosition
// field, this is purely a local UI concept (see usePoleStandardData.js for
// how onGL/underGL heights are derived from the API's flat height list).
export const GROUND_POSITION_OPTIONS = [
  { id: "onGL", label: "On GL" },
  { id: "underGL", label: "Under GL" },
];
