import * as yup from "yup";

// Reusable transform: konversi string kosong → undefined, lainnya → Number
const toNumber = (_, val) =>
  val === "" || val === null ? undefined : Number(val);

export const PoleConfigSchema = yup.object({
  // ===== lowestHeight: gabungan underGL & upperGL =====
  lowestHeight: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .when("groundPosition", {
      is: "underGL",
      then: (schema) =>
        schema
          .required("Required field")
          .lessThan(0, "Value must be less than 0"),
    })
    .when("groundPosition", {
      is: "upperGL",
      then: (schema) =>
        schema.required("Required field").moreThan(0, "Must be greater than 0"),
    }),

  // ===== overdesignFactor =====
  overdesignFactor: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),
});
