import * as yup from "yup";

// 1. Buat reusable schema untuk angka
const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

// 2. Terapkan ke dalam BoxTypeSchema
export const BoxTypeSchema = yup.object({
  boxWidth: numberField,
  opWidth: numberField,
  boxHeight: numberField,
  opSurfaceHeight: numberField,
  opLength: numberField,
});
