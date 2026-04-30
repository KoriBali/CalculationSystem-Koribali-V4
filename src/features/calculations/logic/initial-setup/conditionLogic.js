// Auto-fill defaults for specific design standards
export const STANDARD_DEFAULTS = {
  v60: { designWindSpeed: "60", designAirDensity: "1.23" }, // key sudah diupdate
  jil: { designWindSpeed: "60", designAirDensity: "1.23" },
};

// Returns updated object with auto-filled values if standard has defaults
export function applyStandardDefaults(updates) {
  if (updates.designStandard && STANDARD_DEFAULTS[updates.designStandard]) {
    return {
      ...updates,
      ...STANDARD_DEFAULTS[updates.designStandard],
    };
  }
  return updates;
}

// Returns list of component names that were enabled but are now disabled
export function getDisabledComponents(prev, next) {
  const disabled = [];

  if (prev.openingEnabled && !next.openingEnabled) disabled.push("Opening");
  if (prev.baseplateEnabled && !next.baseplateEnabled)
    disabled.push("Baseplate");
  if (prev.foundationEnabled && !next.foundationEnabled)
    disabled.push("Foundation");

  return disabled;
}
