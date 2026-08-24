import * as yup from "yup";

export const StraightTypeSchema = (condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;

  const optionalNumberField = (label) =>
    yup
      .number()
      .transform((_, val) => (val === "" ? undefined : Number(val)))
      .typeError(`${label} must be a number`)
      .nullable()
      .notRequired();

  const requiredNumberField = (label) =>
    yup
      .number()
      .transform((_, val) => (val === "" ? undefined : Number(val)))
      .typeError(`${label} must be a number`)
      .required(`${label} is required`);

  return yup.object({
    upperThickness: requiredNumberField("Upper Pole Thickness"),

    upperLength: requiredNumberField("Upper Pole Length").min(
      0,
      "Upper Pole Length must be positive",
    ),

    lowerThickness: requiredNumberField("Lower Pole Thickness"),

    lowerLength: requiredNumberField("Lower Pole Length").min(
      0,
      "Lower Pole Length must be positive",
    ),

    // ===== EMBEDMENT =====
    embedmentLength: optionalNumberField("Embedment Length").when([], {
      is: () => isEmbedment,
      then: (schema) => schema.required("Embedment Length is required"),
    }),

    // ===== BASE =====
    groundPosition: yup.string().when([], {
      is: () => isBase,
      then: (schema) => schema.required("Please select a ground position"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // ===== UNDER & UPPER GL ONLY =====
    heightDepth: optionalNumberField("Depth")
      .when("groundPosition", {
        is: (val) => isBase && val === "underGL",
        then: (schema) =>
          schema
            .required("Depth is required")
            .lessThan(0, "Depth must be less than 0"),
      })
      .when("groundPosition", {
        is: (val) => isBase && val === "upperGL",
        then: (schema) =>
          schema
            .required("Depth is required")
            .moreThan(0, "Depth must be greater than 0"),
      }),
  });
};
