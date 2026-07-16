import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

const optionalNumberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .min(0, "Must be positive")
  .nullable()
  .optional();

export const RoundCaissonTypeSchema = yup.object({
  foundationWidthX: optionalNumberField,
  foundationWidthY: numberField,
  embedmentDepth: numberField,
  nValue: numberField,
  yValue: numberField,
  ycValue: numberField,
  alphaValue: numberField,
});
