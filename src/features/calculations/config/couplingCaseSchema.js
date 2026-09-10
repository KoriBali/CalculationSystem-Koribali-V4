/**
 * couplingCaseSchema.js
 *
 * Field metadata + the transforms that turn /api/master/coupling into the
 * shapes the coupling form consumes.
 *
 * The list of positions/sizes/types and the 10 case configurations are NOT
 * defined here — they come from the backend (single source of truth) via
 * useCouplingMasterData(). This file only holds:
 *
 * FIELD_META   — per-field UI metadata the API doesn't provide (input type,
 *                unit, placeholder, base label).
 * build*()     — API master data → { fieldOptions, caseSchema, caseList }.
 * emptyCP / pickActiveFields / fieldLabel — form-state helpers.
 */

// ─── Field definitions ──────────────────────────────────────────────────────

export const FIELD_META = {
  position: {
    label: "Coupling Position",
    unit: null,
    inputType: "select",
    placeholder: "Select Position",
  },
  size: {
    label: "Coupling Size",
    unit: null,
    inputType: "select",
    placeholder: "Select Size",
  },
  type: {
    label: "Coupling Type",
    unit: null,
    inputType: "select",
    placeholder: "Select Type",
  },
  verticalAngle: {
    label: "Vertical Angle",
    unit: "deg",
    inputType: "number",
    placeholder: "e.g. 90",
  },
  distance: {
    label: "Distance (d)",
    unit: "mm",
    inputType: "number",
    placeholder: "e.g. 100",
  },
  horizontalAngle: {
    label: "Horizontal Angle (θ)",
    unit: "deg",
    inputType: "number",
    placeholder: "e.g. 90",
  },
};

// ─── Base fields shared by every CP ─────────────────────────────────────────

const BASE_CP_FIELDS = ["position", "size", "type", "verticalAngle"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns an empty state object for a single CP.
 * All possible fields are always defined (empty) to avoid undefined issues.
 * Only activeFields will be rendered and sent.
 */
export const emptyCP = () => ({
  position: "",
  size: "",
  type: "",
  verticalAngle: "",
  distance: "",
  horizontalAngle: "",
  eo: {
    bushing: false,
    terminalCap: false,
    nipple: false,
    other: false,
    otherText: "",
  },
});

/**
 * Picks only the activeFields from a CP state object, casting number fields.
 * Used to build the clean BE payload.
 */
const NUMBER_FIELDS = new Set(["verticalAngle", "distance", "horizontalAngle"]);

export function pickActiveFields(cpState, activeFields) {
  return activeFields.reduce((acc, field) => {
    acc[field] = NUMBER_FIELDS.has(field)
      ? Number(cpState[field])
      : cpState[field];
    return acc;
  }, {});
}

/**
 * Resolves the display label for a field within a given CP schema,
 * honoring an optional per-case `labels` override.
 */
export function fieldLabel(cpSchema, field) {
  return cpSchema?.labels?.[field] ?? FIELD_META[field].label;
}

// ─── Transforms: /api/master/coupling → form-ready shapes ────────────────────
//
// useCouplingMasterData() runs these on the API response and hands the results
// to the coupling form. There is no hardcoded copy of this data anymore — the
// backend is the single source of truth.

const toSelectOptions = (list) =>
  (list || [])
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.code, label: item.label }));

// Build the { position, size, type } option map from API master data.
export function buildFieldOptions(master) {
  return {
    position: toSelectOptions(master?.couplingPositions),
    size: toSelectOptions(master?.couplingSizes),
    type: toSelectOptions(master?.couplingTypes),
  };
}

// cp*Shape → the extra field that shape adds on top of BASE_CP_FIELDS.
const SHAPE_EXTRA_FIELD = {
  single: null,
  pair_distance: "distance",
  pair_angular: "horizontalAngle",
};

// "Horizontal Angle (θ)" → "Horizontal Angle"
const stripSymbol = (label) => label.replace(/\s*\([^)]*\)\s*$/, "");

function buildCpSchema(shape, symbol) {
  if (!shape) return null;
  const extra = SHAPE_EXTRA_FIELD[shape] ?? null;
  const activeFields = extra ? [...BASE_CP_FIELDS, extra] : [...BASE_CP_FIELDS];
  const cp = { activeFields };
  // API sends only the diagram symbol ("θ1", "d"); FE keeps the descriptive
  // prefix and just swaps what's in the parentheses.
  if (extra && symbol) {
    cp.labels = { [extra]: `${stripSymbol(FIELD_META[extra].label)} (${symbol})` };
  }
  return cp;
}

// Build the { [caseNumber]: schema } map from API `couplingCases`.
export function buildCaseSchema(master) {
  const out = {};
  (master?.couplingCases || [])
    .filter((c) => c.isActive)
    .forEach((c) => {
      out[c.caseNumber] = {
        hasDualCp: c.numGroups === 2,
        cp1: buildCpSchema(c.cp1Shape, c.cp1Label),
        cp2: buildCpSchema(c.cp2Shape, c.cp2Label),
      };
    });
  return out;
}

// Build the case grid list (id/title/image) from API `couplingCases`.
export function buildCaseList(master) {
  return (master?.couplingCases || [])
    .filter((c) => c.isActive)
    .map((c) => ({
      id: c.caseNumber,
      caseNumber: c.caseNumber,
      title: `Case ${c.caseNumber} of Coupling`,
      image: c.imageUrl,
      detailImage: c.detailImageUrl,
    }));
}
