import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

export const RTypeSchema = yup.object({
  opWidth: numberField,
  opSurfaceHeight: numberField,
  opLength: numberField,
});
