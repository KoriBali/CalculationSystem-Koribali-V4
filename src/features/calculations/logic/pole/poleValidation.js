import { validateWithYup } from "../../utils";
import { PoleConfigSchema } from "../../schemas/pole/custom/PoleConfigSchema";
import { PoleStructuralSchema } from "../../schemas/pole/custom/PoleStructuralSchema";
import { PoleFormSchema } from "../../schemas/pole/custom/PoleFormSchema";
import { DirectObjectSchema } from "../../schemas/pole/custom/DirectObjectSchema";
import { OverheadWireSchema } from "../../schemas/pole/custom/OverheadWireSchema";
import { ArmSchema } from "../../schemas/pole/custom/ArmSchema";
import { ArmObjectSchema } from "../../schemas/pole/custom/ArmObjectSchema";
import { PoleTypeSchema } from "../../schemas/pole/standard/PoleTypeSchema";
import { StraightTypeSchema } from "../../schemas/pole/standard/StraightTypeSchema";

// JSON data source for standard pole specifications
import STANDARD_POLE_DATA from "../../data/specStandardPole.json";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const resolveData = ({
  condition,
  poleTypeStandard,
  taperPoleStandard,
  straightPoleStandard,
  poles,
  directObjects,
  arms,
  overheadWires,
}) => {
  const empty = { poles: [], directObjects: [], arms: [], overheadWires: [] };

  if (condition.poleType !== "standard") {
    return { poles, directObjects, arms, overheadWires };
  }

  const type = poleTypeStandard.type;

  if (type === "taper") {
    const selectedPole =
      STANDARD_POLE_DATA?.taper?.[taperPoleStandard.poleType]?.[
        taperPoleStandard.groundPosition
      ]?.[taperPoleStandard.height];

    if (!selectedPole)
      return { error: "Standard taper pole data not found.", ...empty };

    return {
      poles: selectedPole.poles || [],
      directObjects: selectedPole.directObjects || [],
      arms: selectedPole.arms || [],
      overheadWires: selectedPole.overheadWires || [],
    };
  }

  if (type === "straight") {
    const key = straightPoleStandard.combination;
    if (!key) return { error: "Please select pole combination.", ...empty };

    const selectedPole = STANDARD_POLE_DATA?.straight?.[key];
    if (!selectedPole)
      return { error: "Standard straight pole data not found.", ...empty };

    const lengths = [
      Number(straightPoleStandard.upperLength || 0),
      Number(straightPoleStandard.lowerLength || 0),
    ];

    const heights = lengths.map((_, i) =>
      lengths.slice(i).reduce((sum, val) => sum + val, 0),
    );

    const resolvedPoles = selectedPole.poles.map((sec, index) => {
      const thickness =
        index === 0
          ? straightPoleStandard.upperThickness
          : straightPoleStandard.lowerThickness;

      return {
        ...sec,
        lowerThickness: thickness,
        upperThickness: thickness,
        zHeight: heights[index],
      };
    });

    return {
      poles: resolvedPoles,
      directObjects: [],
      arms: [],
      overheadWires: [],
    };
  }

  return empty;
};

// ─── MAIN VALIDATOR ───────────────────────────────────────────────────────────
export async function validatePoleForm({
  condition,
  poleTypeStandard,
  taperPoleStandard,
  straightPoleStandard,
  poleConfig,
  poles,
  directObjects,
  overheadWires,
  arms,
}) {
  const isCustom = condition.poleType !== "standard";
  const isStandard = condition.poleType === "standard";
  const isStraight = poleTypeStandard?.type === "straight";

  // ── 1. Structural Design (custom only) ──
  if (isCustom) {
    const { isValid, errors } = await validateWithYup(
      PoleConfigSchema,
      poleConfig,
    );

    if (!isValid) {
      return {
        isValid: false,
        poleConfigErrors: errors,
        message: "Please correct the errors in Structural Design fields.",
      };
    }
  }

  // ── 2. Pole Type Standard (standard only) ──
  if (isStandard) {
    const { isValid } = await validateWithYup(PoleTypeSchema, poleTypeStandard);
    if (!isValid) {
      return { isValid: false, message: "Please select the pole type first." };
    }
  }

  // ── 3. Step Pole Standard (straight standard) ──
  if (isStandard && isStraight) {
    const { isValid, errors } = await validateWithYup(
      StraightTypeSchema,
      straightPoleStandard,
    );

    if (!isValid) {
      return {
        isValid: false,
        straightPoleStandardErrors: errors,
        message:
          "Please correct the errors in Stepped Pole Type Specifications fields.",
      };
    }
  }

  // ── 4. Resolve data source ──
  const resolved = resolveData({
    condition,
    poleTypeStandard,
    taperPoleStandard,
    straightPoleStandard,
    poles,
    directObjects,
    arms,
    overheadWires,
  });

  if (resolved.error) {
    return { isValid: false, message: resolved.error };
  }

  if (isStandard && (!resolved.poles || resolved.poles.length === 0)) {
    return {
      isValid: false,
      message: "Please complete all required standard selections.",
    };
  }

  // ── 5. Validate each pole (custom only) ──
  if (isCustom) {
    for (const pole of resolved.poles || []) {
      // Basic Form Validation
      const formResult = await validateWithYup(PoleFormSchema, pole);
      if (!formResult.isValid) {
        return {
          isValid: false,
          polesErrors: { [pole.id]: formResult.errors },
          message: "Please correct the errors in Pole Specification fields.",
        };
      }

      // Structural Validation
      const structuralResult = await validateWithYup(
        PoleStructuralSchema,
        pole,
      );
      if (!structuralResult.isValid) {
        return {
          isValid: false,
          polesErrors: { [pole.id]: structuralResult.errors },
          message: "Please correct the errors in Pole Specification fields.",
        };
      }
    }
  }

  // ── 6. Validate Direct Objects (custom only) ──
  if (isCustom) {
    for (const directObject of resolved.directObjects || []) {
      const { isValid, errors } = await validateWithYup(
        DirectObjectSchema,
        directObject,
      );
      if (!isValid) {
        return {
          isValid: false,
          doErrors: { [directObject.idDo]: errors },
          message: "Please correct the errors in Direct Object fields.",
        };
      }
    }
  }

  // ── 7. Validate Overhead Wires (custom only) ──
  if (isCustom) {
    for (const ohw of resolved.overheadWires || []) {
      const { isValid, errors } = await validateWithYup(
        OverheadWireSchema,
        ohw,
      );
      if (!isValid) {
        return {
          isValid: false,
          ohwErrors: { [ohw.idOhw]: errors },
          message: "Please correct the errors in Overhead Wire fields.",
        };
      }
    }
  }

  // ── 8. Validate Arms (custom only) ──
  if (isCustom) {
    for (const arm of resolved.arms || []) {
      const armResult = await validateWithYup(ArmSchema, arm);
      if (!armResult.isValid) {
        return {
          isValid: false,
          armsErrors: { [arm.idArm]: armResult.errors },
          message: "Please correct the errors in Arm Specification fields.",
        };
      }

      // ── 9. Validate Arm Objects ──
      for (const ao of arm.armObjects || []) {
        const aoResult = await validateWithYup(ArmObjectSchema, ao);
        if (!aoResult.isValid) {
          return {
            isValid: false,
            aoErrors: { [ao.idAo]: aoResult.errors },
            message: "Please correct the errors in Arm Object fields.",
          };
        }
      }
    }
  }

  return {
    isValid: true,
    resolvedPoles: resolved.poles,
    resolvedDirectObjects: resolved.directObjects,
    resolvedOverheadWires: resolved.overheadWires,
    resolvedArms: resolved.arms,
  };
}

// ─── REPORT VALIDATOR ─────────────────────────────────────────────────────────
export async function validatePoleReport(params) {
  const { results, isCoverComplete } = params;

  if (!results || results.length === 0) {
    return {
      isValid: false,
      message: "No calculation results available. Please calculate first.",
    };
  }

  // Note: For coverErrors, you should ideally use a Yup schema for Cover as well
  // to fully remove dependency on Utils.
  if (!isCoverComplete()) {
    return {
      isValid: false,
      message: "Please complete the Cover Information fields.",
    };
  }

  return validatePoleForm(params);
}
