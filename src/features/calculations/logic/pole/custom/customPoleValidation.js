import { validateWithYup } from "../../../utils";
import { PoleConfigSchema } from "../../../schemas/pole/custom/PoleConfigSchema";
import { PoleFormSchema } from "../../../schemas/pole/custom/PoleFormSchema";
import { PoleStructuralSchema } from "../../../schemas/pole/custom/PoleStructuralSchema";
import { DirectObjectSchema } from "../../../schemas/pole/custom/DirectObjectSchema";
import { OverheadWireSchema } from "../../../schemas/pole/custom/OverheadWireSchema";
import { ArmSchema } from "../../../schemas/pole/custom/ArmSchema";
import { ArmObjectSchema } from "../../../schemas/pole/custom/ArmObjectSchema";

// ─── POLE CONFIG (STRUCTURAL DESIGN) ─────────────────────────────────────────

// Validates pole config fields (lowestStep, lowestStepMode, overDesign)
export async function validatePoleConfig(poleConfig) {
  const { isValid, errors } = await validateWithYup(
    PoleConfigSchema,
    poleConfig,
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Structural Design fields.",
    };
  }

  return { isValid: true };
}

// ─── POLES ────────────────────────────────────────────────────────────────────

// Validates a single pole's form fields
export async function validatePole(pole) {
  const { isValid, errors } = await validateWithYup(PoleFormSchema, pole);

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Pole Specification fields.",
    };
  }

  return { isValid: true };
}

// Validates all poles — returns on first failure
export async function validateAllPoles(poles) {
  for (const pole of poles ?? []) {
    const result = await validatePole(pole);
    if (!result.isValid) return result;
  }
  return { isValid: true };
}

// Cross-validates poles against pole config constraints (e.g. height vs lowestStep)
export async function validatePoleStructural(poles, poleConfig) {
  const schema = PoleStructuralSchema(poleConfig);

  const { isValid, errors } = await validateWithYup(schema, poles);

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: Object.values(errors)[0],
    };
  }

  return { isValid: true };
}

// ─── DIRECT OBJECTS ───────────────────────────────────────────────────────────

// Validates a single direct object
export async function validateDirectObject(directObject) {
  const { isValid, errors } = await validateWithYup(
    DirectObjectSchema,
    directObject,
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Direct Object fields.",
    };
  }

  return { isValid: true };
}

// Validates all direct objects — returns on first failure
export async function validateAllDirectObjects(directObjects) {
  for (const directObject of directObjects ?? []) {
    const result = await validateDirectObject(directObject);
    if (!result.isValid) return result;
  }
  return { isValid: true };
}

// ─── OVERHEAD WIRES ───────────────────────────────────────────────────────────

// Validates a single overhead wire
export async function validateOverheadWire(overheadWire) {
  const { isValid, errors } = await validateWithYup(
    OverheadWireSchema,
    overheadWire,
  );

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Overhead Wire fields.",
    };
  }

  return { isValid: true };
}

// Validates all overhead wires — returns on first failure
export async function validateAllOverheadWires(overheadWires) {
  for (const overheadWire of overheadWires ?? []) {
    const result = await validateOverheadWire(overheadWire);
    if (!result.isValid) return result;
  }
  return { isValid: true };
}

// ─── ARMS ─────────────────────────────────────────────────────────────────────

// Validates a single arm
export async function validateArm(arm) {
  const { isValid, errors } = await validateWithYup(ArmSchema, arm);

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Arm Specification fields.",
    };
  }

  return { isValid: true };
}

// Validates all arms — returns on first failure
export async function validateAllArms(arms) {
  for (const arm of arms ?? []) {
    const result = await validateArm(arm);
    if (!result.isValid) return result;
  }
  return { isValid: true };
}

// ─── ARM OBJECTS ──────────────────────────────────────────────────────────────

// Validates a single arm object
export async function validateArmObject(armObject) {
  const { isValid, errors } = await validateWithYup(ArmObjectSchema, armObject);

  if (!isValid) {
    return {
      isValid: false,
      errors,
      message: "Please correct the errors in Arm Object fields.",
    };
  }

  return { isValid: true };
}

// Validates all arm objects across all arms — returns on first failure
export async function validateAllArmObjects(arms) {
  for (const arm of arms ?? []) {
    for (const armObject of arm.armObjects ?? []) {
      const result = await validateArmObject(armObject);
      if (!result.isValid) return result;
    }
  }
  return { isValid: true };
}
