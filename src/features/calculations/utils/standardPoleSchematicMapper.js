/**
 * standardPoleSchematicMapper.js
 * Maps Standard Pole calculation inputs (specifically types: IA, IS, LA, LS, TA, TS)
 * from specStandardPole.json into the parameters format expected by the Drawing Engine.
 */

import STANDARD_POLE_DATA from "../data/specStandardPole.json";

// Supported standard pole types for schematic generation
export const SUPPORTED_SCHEMATIC_POLE_TYPES = ["IA", "IS", "LA", "LS", "TA", "TS"];

/**
 * Checks whether a given taper pole type is supported by the schematic drawing engine.
 * @param {string} poleType
 * @returns {boolean}
 */
export function isSchematicSupportedPole(poleType) {
  if (!poleType) return false;
  return SUPPORTED_SCHEMATIC_POLE_TYPES.includes(poleType.toUpperCase());
}

/**
 * Resolves standard pole entry from specStandardPole.json and builds
 * the exact payload structure required by Amir's Drawing Engine.
 *
 * @param {object} params
 * @param {object} params.taperPoleStandard - { poleType, groundPosition, height, embedmentLength }
 * @param {object} [params.condition] - { baseplateEnabled, ... }
 * @returns {object|null} Returns { standardId, payload } or null if not supported/available.
 */
export function getStandardPoleSchematicParameters({ taperPoleStandard, condition = {} }) {
  if (!taperPoleStandard || !taperPoleStandard.poleType) return null;

  const type = taperPoleStandard.poleType.toUpperCase();
  if (!isSchematicSupportedPole(type)) {
    return null;
  }

  const isEmbedment =
    !condition.baseplateEnabled && taperPoleStandard.groundPosition === "underGL";

  const rawHeight = Number(taperPoleStandard.height);
  const normalizedHeight = !isNaN(rawHeight) && rawHeight > 0
    ? String(Math.round(rawHeight * 10) / 10)
    : String(taperPoleStandard.height || "");

  const heightKey = isEmbedment
    ? (rawHeight + 0.3).toFixed(1)
    : normalizedHeight;

  const dataTaper = STANDARD_POLE_DATA?.tapered || STANDARD_POLE_DATA?.taper || {};
  const groundGroup = dataTaper?.[type]?.[taperPoleStandard.groundPosition || "onGL"] || {};
  const selectedPole =
    groundGroup[heightKey] ||
    groundGroup[String(rawHeight)] ||
    Object.values(groundGroup)[0];

  if (!selectedPole) {
    return null;
  }

  const rawPoles = selectedPole.poles || [];
  const rawDOs = selectedPole.directObjects || [];
  const rawArms = selectedPole.arms || [];

  // ── 1. MAP POLES & CALCULATE SEGMENT HEIGHTS ──
  // specStandardPole.json stores cumulative zHeight from ground upwards.
  // Drawing Engine expects individual segment length in 'height'.
  const poles = [];
  const n = rawPoles.length;

  if (n === 1) {
    const p = rawPoles[0];
    poles.push({
      name: p.name || "Pole 1",
      material: p.material || "STK400",
      type: "tapered",
      Lower_D: Number(p.lowerDiameter),
      Upper_D: Number(p.upperDiameter),
      thickness: Number(p.lowerThickness),
      upperThickness: Number(p.upperThickness || p.lowerThickness),
      height: Number(p.zHeight),
      quantity: 1,
    });
  } else if (n === 2) {
    const [top, bottom] = rawPoles;
    poles.push({
      name: top.name || "Pole 1",
      material: top.material || "STK400",
      type: "tapered",
      Lower_D: Number(top.lowerDiameter),
      Upper_D: Number(top.upperDiameter),
      thickness: Number(top.lowerThickness),
      upperThickness: Number(top.upperThickness || top.lowerThickness),
      height: Number(top.zHeight) - Number(bottom.zHeight),
      quantity: 1,
    });
    poles.push({
      name: bottom.name || "Pole 2",
      material: bottom.material || "STK400",
      type: "straight",
      Lower_D: Number(bottom.lowerDiameter),
      Upper_D: Number(bottom.upperDiameter),
      thickness: Number(bottom.lowerThickness),
      upperThickness: Number(bottom.upperThickness || bottom.lowerThickness),
      height: Number(bottom.zHeight),
      quantity: 1,
    });
  } else if (n >= 3) {
    const [top, middle, bottom] = rawPoles.slice(0, 3);
    poles.push({
      name: top.name || "Pole 1",
      material: top.material || "STK400",
      type: "straight",
      Lower_D: Number(top.lowerDiameter),
      Upper_D: Number(top.upperDiameter),
      thickness: Number(top.lowerThickness),
      upperThickness: Number(top.upperThickness || top.lowerThickness),
      height: Number(top.zHeight) - Number(middle.zHeight),
      quantity: 1,
    });
    poles.push({
      name: middle.name || "Pole 2",
      material: middle.material || "STK400",
      type: "tapered",
      Lower_D: Number(middle.lowerDiameter),
      Upper_D: Number(middle.upperDiameter),
      thickness: Number(middle.lowerThickness),
      upperThickness: Number(middle.upperThickness || middle.lowerThickness),
      height: Number(middle.zHeight) - Number(bottom.zHeight),
      quantity: 1,
    });
    poles.push({
      name: bottom.name || "Pole 3",
      material: bottom.material || "STK400",
      type: "straight",
      Lower_D: Number(bottom.lowerDiameter),
      Upper_D: Number(bottom.upperDiameter),
      thickness: Number(bottom.lowerThickness),
      upperThickness: Number(bottom.upperThickness || bottom.lowerThickness),
      height: Number(bottom.zHeight),
      quantity: 1,
    });
  }

  // ── 2. MAP DIRECT OBJECTS (IA, IS) ──
  const directObjects = rawDOs.slice(0, 1).map((d) => ({
    name: d.name || "灯具",
    height: Number(d.zHeight),
    quantity: Number(d.quantity || 1),
  }));

  // ── 3. MAP ARMS (LA, LS) ──
  const arms = rawArms.slice(0, 2).map((a, idx) => ({
    name: a.name || `Arm ${idx + 1}`,
    material: a.material || "STK400",
    type: "straight",
    diameter: Number(a.diameter),
    thickness: Number(a.thickness),
    height: Number(a.zHeight),
    length: Number(a.length),
    fixAngle: Number(a.fixAngle || 0),
    verticalAngle: 0,
  }));

  return {
    standardId: selectedPole.standardId || `${type}-${heightKey}`,
    poleType: type,
    payload: {
      poles,
      arms,
      directObjects,
      overHeadWires: [],
    },
  };
}
