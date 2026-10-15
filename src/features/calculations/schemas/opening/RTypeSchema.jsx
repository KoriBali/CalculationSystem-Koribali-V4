import * as yup from "yup";

const numberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be positive`);

// `requireDirection` — true when this project also produces a drawing
// (projectMode "both"), since Opening Direction only feeds the drawing output.
export const RTypeSchema = (requireDirection) =>
  yup.object({
    opWidth: numberField("Cut Width"),
    opSurfaceHeight: numberField("Opening Cut Length"),
    opLength: numberField("Opening Center Height"),
    openingDirection: requireDirection
      ? yup.string().required("Opening Direction is required")
      : yup.string(),
  });
