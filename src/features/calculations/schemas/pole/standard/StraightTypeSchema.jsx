import * as yup from "yup";

export const StraightTypeSchema = (condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;

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
    embedmentLength: yup.number().when([], {
      is: () => isEmbedment,
      then: (schema) =>
        schema.typeError("Must be a number").required("Required field"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // ===== BASE =====
    groundPosition: yup.string().when([], {
      is: () => isBase,
      then: (schema) => schema.required("Required field"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // ===== UNDER GL ONLY =====
    heightDepth: yup.number().when("groundPosition", {
      is: (val) => isBase && val === "underGL",
      then: (schema) =>
        schema
          .typeError("Must be a number")
          .required("Required field")
          .lessThan(0, "Value must be less than 0"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};
