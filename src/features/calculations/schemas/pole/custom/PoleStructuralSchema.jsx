import * as yup from "yup";
import { PoleFormSchema } from "./PoleFormSchema";

export const PoleStructuralSchema = (poleConfig) => {
  const lowestHeight = Number(poleConfig.lowestHeight);

  return yup
    .array()
    .of(PoleFormSchema)
    .min(1, "No pole data available.")
    .test("pole-validation", "", function (poles) {
      if (!poles || poles.length === 0) return false;

      for (let i = 0; i < poles.length; i++) {
        const poleNumber = i + 1;
        const current = poles[i];
        const previous = poles[i - 1];

        const lowerDiamater = Number(current.lowerDiameter);
        const upperDiameter = Number(current.upperDiameter);
        const lowerThickness = Number(current.lowerThickness);
        const upperThickness = Number(current.upperThickness);
        const heightCurrent = Number(current.height);

        // ERROR 1 — Height <= 0
        if (!heightCurrent || heightCurrent <= 0) {
          return this.createError({
            message: `Pole ${poleNumber}: Height must be greater than 0.`,
            path: `[${i}].height`,
          });
        }

        // ERROR 2 — Urutan height
        if (i > 0) {
          const hPrevious = Number(previous.height);

          if (heightCurrent > hPrevious) {
            return this.createError({
              message: `Pole ${poleNumber}: Height must not be higher than previous step.`,
              path: `[${i}].height`,
            });
          }
        }

        // ERROR 3 — Lowest step
        if (i === poles.length - 1) {
          if (lowestHeight >= heightCurrent) {
            return this.createError({
              message: `Pole ${poleNumber}: Lowest height must be lower than bottom step.`,
              path: `[${i}].height`,
            });
          }
        }

        // ERROR 4 — Taper diameter
        if (current.type === "Taper") {
          if (upperDiameter >= lowerDiamater) {
            return this.createError({
              message: `Pole ${poleNumber}: Upper diameter must be smaller than lower diameter.`,
              path: `[${i}].upperDiameter`,
            });
          }
        }

        // ERROR 5 — Diameter continuity
        if (i > 0) {
          const prevLower = Number(previous.lowerDiameter);

          if (upperDiameter < prevLower) {
            return this.createError({
              message: `Pole ${poleNumber}: Diameter continuity error.`,
              path: `[${i}].upperDiameter`,
            });
          }
        }

        // ERROR 6 — Thickness vs diameter
        if (lowerThickness > lowerDiamater / 2) {
          return this.createError({
            message: `Pole ${poleNumber}: Lower thickness too large.`,
            path: `[${i}].lowerThickness`,
          });
        }

        if (upperThickness > upperDiameter / 2) {
          return this.createError({
            message: `Pole ${poleNumber}: Upper thickness too large.`,
            path: `[${i}].upperThickness`,
          });
        }
      }

      return true;
    });
};
