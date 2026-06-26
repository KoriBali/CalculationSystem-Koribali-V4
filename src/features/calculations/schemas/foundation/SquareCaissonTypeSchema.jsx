import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

export const SquareCaissonTypeSchema = yup.object({
  foundationWidthX: numberField,
  foundationWidthY: numberField,
  embedmentDepth: numberField,
  nValue: numberField,
  yValue: numberField,
  ycValue: numberField,
  alphaValue: numberField,
});
