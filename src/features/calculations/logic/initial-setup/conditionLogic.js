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

// Saves calculation config to localStorage — used by header nav to determine visible steps
export function saveCalculationConfig(projectType, condition) {
  const config = {
    pole: true,
    opening: !!condition.openingEnabled,
    baseplate: !!condition.baseplateEnabled,
    foundation: !!condition.foundationEnabled,
  };
  localStorage.setItem(
    `${projectType}_calculation_config`,
    JSON.stringify(config),
  );
}

// Cleans up localStorage for components that were disabled
export function cleanupDisabledComponents(projectType, condition) {
  if (!condition.openingEnabled) {
    localStorage.removeItem(`${projectType}_openingType`);
    localStorage.removeItem(`${projectType}_boxType`);
    localStorage.removeItem(`${projectType}_rType`);
  }

  if (!condition.baseplateEnabled) {
    localStorage.removeItem(`${projectType}_baseplateType`);
    localStorage.removeItem(`${projectType}_fourRibType`);
    localStorage.removeItem(`${projectType}_eightRibType`);
  }

  if (!condition.foundationEnabled) {
    localStorage.removeItem(`${projectType}_foundationType`);
    localStorage.removeItem(`${projectType}_squareCaisson`);
    localStorage.removeItem(`${projectType}_roundCaisson`);
  }
}
