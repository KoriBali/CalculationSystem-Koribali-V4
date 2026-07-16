import * as yup from "yup";

export const StraightTypeSchema = (condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;

  const optionalNumberField = yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError("Must be a number")
    .nullable()
    .notRequired();

  const requiredNumberField = yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError("Must be a number")
    .required("Required field");

  return yup.object({
    upperThickness: requiredNumberField,

    upperLength: requiredNumberField.min(0, "Must be positive"),

    lowerThickness: requiredNumberField,

    lowerLength: requiredNumberField.min(0, "Must be positive"),

    // ===== EMBEDMENT =====
    embedmentLength: optionalNumberField.when([], {
      is: () => isEmbedment,
      then: (schema) => schema.required("Required field"),
    }),

    // ===== BASE =====
    groundPosition: yup.string().when([], {
      is: () => isBase,
      then: (schema) => schema.required("Required field"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // ===== UNDER & UPPER GL ONLY =====
    heightDepth: optionalNumberField
      .when("groundPosition", {
        is: (val) => isBase && val === "underGL",
        then: (schema) =>
          schema
            .required("Required field")
            .lessThan(0, "Value must be less than 0"),
      })
      .when("groundPosition", {
        is: (val) => isBase && val === "upperGL",
        then: (schema) =>
          schema
            .required("Required field")
            .moreThan(0, "Must be greater than 0"),
      }),
  });
};
