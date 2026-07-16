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

  return yup.object({
    upperThickness: yup.number().required("Required field"),

    upperLength: yup
      .number()
      .typeError("Must be a number")
      .required("Required field")
      .min(0, "Must be positive"),

    lowerThickness: yup.number().required("Required field"),

    lowerLength: yup
      .number()
      .typeError("Must be a number")
      .required("Required field")
      .min(0, "Must be positive"),

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

    // ===== UNDER GL ONLY =====
    heightDepth: optionalNumberField.when("groundPosition", {
      is: (val) => isBase && val === "underGL",
      then: (schema) =>
        schema
          .required("Required field")
          .lessThan(0, "Value must be less than 0"),
    }),
  });
};
