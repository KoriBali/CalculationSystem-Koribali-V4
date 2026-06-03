import * as yup from "yup";
import { PoleFormSchema } from "./PoleFormSchema";

export const PoleStructuralSchema = (poleConfig) => {
  const lowestHeight = Number(poleConfig?.lowestHeight);

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
        const isStraight = current.type === "Straight";

        const lowerDiameter = Number(current.lowerDiameter);
        const upperDiameter = Number(current.upperDiameter);
        const lowerThickness = Number(current.lowerThickness);
        const upperThickness = Number(current.upperThickness);
        const heightCurrent = Number(current.zHeight);

        // ERROR 1 — Height <= 0
        if (!heightCurrent || heightCurrent <= 0) {
          return this.createError({
            message: `Pole ${poleNumber}: Height must be greater than 0.`,
            path: `[${i}].zHeight`,
          });
        }

        // ERROR 2 — Height order (must decrease per step)
        if (i > 0) {
          const hPrevious = Number(previous.zHeight);

          if (heightCurrent > hPrevious) {
            return this.createError({
              message: `Pole ${poleNumber}: Height must not be higher than the previous step.`,
              path: `[${i}].zHeight`,
            });
          }
        }

        // ERROR 3 — Bottom step height vs lowest height
        if (i === poles.length - 1) {
          if (lowestHeight >= heightCurrent) {
            return this.createError({
              message: `Pole ${poleNumber}: Lowest height must be lower than the bottom step height.`,
              path: `[${i}].zHeight`,
            });
          }
        }

        // ERROR 4 — Taper: upper diameter must be smaller than lower
        if (!isStraight) {
          if (upperDiameter >= lowerDiameter) {
            return this.createError({
              message: `Pole ${poleNumber}: Upper diameter must be smaller than lower diameter.`,
              path: `[${i}].upperDiameter`,
            });
          }
        }

        // ERROR 5 — Diameter continuity between steps
        if (i > 0) {
          const prevLowerDiameter = Number(previous.lowerDiameter);

          if (upperDiameter < prevLowerDiameter) {
            return this.createError({
              message: isStraight
                ? `Pole ${poleNumber}: Diameter must match the previous pole's lower diameter.`
                : `Pole ${poleNumber}: Upper diameter must match the previous pole's lower diameter.`,
              path: `[${i}].upperDiameter`,
            });
          }
        }

        // ERROR 6 — Lower thickness vs lower diameter
        if (lowerThickness > lowerDiameter / 2) {
          return this.createError({
            message: isStraight
              ? `Pole ${poleNumber}: Thickness exceeds half of the diameter.`
              : `Pole ${poleNumber}: Lower thickness exceeds half of the lower diameter.`,
            path: `[${i}].lowerThickness`,
          });
        }

        // ERROR 7 — Taper: upper thickness vs upper diameter
        if (!isStraight && upperThickness > upperDiameter / 2) {
          return this.createError({
            message: `Pole ${poleNumber}: Upper thickness exceeds half of the upper diameter.`,
            path: `[${i}].upperThickness`,
          });
        }
      }

      return true;
    });
};
