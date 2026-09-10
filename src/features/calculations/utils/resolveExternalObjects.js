/**
 * resolveExternalObjects.js
 *
 * External Object (EO) logic for couplings.
 *
 * The EO list + which EO is auto-applied per region / vertical angle comes from
 * the backend (`externalObjects`, `regions`, `externalObjectAvailabilities` in
 * /api/master/coupling) — see buildEoHelpers(). This file only hardcodes:
 *   - emptyEO()          the EO state shape
 *   - isTypeRequiresEo() JIS = no EO (API has no `requiresExternalObject` flag
 *                        yet — TODO: move to a couplingTypes field)
 *   - the "Other" free-text option, which is FE-only (not master data)
 */

// Backend EO `code` → the key used in EO state objects.
const EO_CODE_TO_KEY = {
  yupilon_bushing: "bushing",
  terminal_cap: "terminalCap",
  nipple: "nipple",
};

// Stable display order for the EO options in the modal.
const EO_KEY_ORDER = ["bushing", "terminalCap", "nipple", "other"];

// FE-only free-text option — never comes from master data.
const OTHER_OPTION = { id: "other", label: "Other" };

/**
 * Returns true if the coupling type requires external objects.
 * JIS types do NOT require EO; standard / short / long DO.
 */
export function isTypeRequiresEo(type) {
  return (
    type != null && ["standard", "short", "long"].includes(type.toLowerCase())
  );
}

/**
 * Returns an empty EO state object.
 */
export const emptyEO = () => ({
  bushing: false,
  terminalCap: false,
  nipple: false,
  other: false,
  otherText: "",
});

/**
 * Builds the EO helpers from /api/master/coupling data. Returns an object with:
 *
 *   regions        [{ value: regionCode, label }]  — for the location selector
 *   options        [{ id: stateKey, label }]       — every EO incl. "Other"
 *   resolve(angle, regionCode)      → EO patch { bushing, terminalCap, nipple }
 *                                     (each true when that EO is auto-applied)
 *   visibleOptions(angle, regionCode) → options shown for this angle/region
 *   isForced(optId, angle, regionCode) → true when auto-selected & locked
 *
 * "Available" (availWhenZero / availWhenNonzero) means the EO is auto-selected
 * AND locked for that region + angle condition; EOs not available are hidden.
 * "Other" is always visible and never forced.
 */
export function buildEoHelpers(master) {
  const objects = (master?.externalObjects || []).filter((o) => o.isActive);
  const regions = (master?.regions || []).filter((r) => r.isActive);
  const availabilities = master?.externalObjectAvailabilities || [];

  const regionIdByCode = Object.fromEntries(regions.map((r) => [r.code, r.id]));
  const keyByObjectId = Object.fromEntries(
    objects.map((o) => [o.id, EO_CODE_TO_KEY[o.code]]),
  );

  const options = [
    ...objects
      .map((o) => ({ id: EO_CODE_TO_KEY[o.code], label: o.label }))
      .filter((o) => o.id),
    OTHER_OPTION,
  ].sort((a, b) => EO_KEY_ORDER.indexOf(a.id) - EO_KEY_ORDER.indexOf(b.id));

  // { stateKey: { zero, nonzero } } for one region
  const availForRegion = (regionCode) => {
    const regionId = regionIdByCode[regionCode];
    const out = {};
    availabilities
      .filter((a) => a.regionId === regionId)
      .forEach((a) => {
        const key = keyByObjectId[a.externalObjectId];
        if (key) out[key] = { zero: a.availWhenZero, nonzero: a.availWhenNonzero };
      });
    return out;
  };

  // undefined for "other" (not governed by availability); boolean otherwise
  const isAvailable = (optId, verticalAngle, regionCode) => {
    if (optId === "other") return undefined;
    const a = availForRegion(regionCode)[optId];
    if (!a) return false;
    return Number(verticalAngle) === 0 ? a.zero : a.nonzero;
  };

  return {
    regions: regions.map((r) => ({ value: r.code, label: r.label })),
    options,

    resolve(verticalAngle, regionCode) {
      const patch = {};
      options.forEach((opt) => {
        if (opt.id === "other") return;
        patch[opt.id] = isAvailable(opt.id, verticalAngle, regionCode) === true;
      });
      return patch;
    },

    visibleOptions(verticalAngle, regionCode) {
      return options.filter(
        (opt) =>
          opt.id === "other" ||
          isAvailable(opt.id, verticalAngle, regionCode) === true,
      );
    },

    isForced(optId, verticalAngle, regionCode) {
      return isAvailable(optId, verticalAngle, regionCode) === true;
    },
  };
}
