import * as yup from "yup";

// Reusable schema factory for a required, non-negative number field.
const numberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be positive`);

// `requireDirection` — true when this project also produces a drawing
// (projectMode "both"), since Opening Direction only feeds the drawing output.
export const BoxTypeSchema = (requireDirection) =>
  yup.object({
    boxWidth: numberField("Box Width"),
    opWidth: numberField("Opening Width"),
    boxHeight: numberField("Box Thickness"),
    opSurfaceHeight: numberField("Opening Surface Height"),
    opLength: numberField("Opening Length"),
    openingDirection: requireDirection
      ? yup.string().required("Opening Direction is required")
      : yup.string(),
  });
