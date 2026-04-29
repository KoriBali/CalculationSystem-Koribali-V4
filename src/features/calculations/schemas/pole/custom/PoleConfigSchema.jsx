import * as yup from "yup";

export const PoleConfigSchema = yup.object({
  // ===== UNDER GL ONLY =====
  lowestHeight: yup.number().when("groundPosition", {
    is: (val) => val === "underGL",
    then: (schema) =>
      schema
        .typeError("Must be a number")
        .required("Required field")
        .lessThan(0, "Value must be less than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // ===== Upper GL ONLY =====
  lowestHeight: yup.number().when("groundPosition", {
    is: (val) => val === "upperGL",
    then: (schema) =>
      schema
        .typeError("Must be a number")
        .required("Required field")
        .moreThan(0, "Must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),

  overdesignFactor: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),
});
