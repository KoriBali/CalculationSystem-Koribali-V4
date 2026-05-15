import * as yup from "yup";

export const PoleFormSchema = yup.object({
  name: yup.string().required("Required field"),

  zHeight: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  quantity: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .integer("Must be a whole number")
    .min(1, "Value must be greater than 0"),

  type: yup.string().required("Required field"),

  lowerDiameter: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  upperDiameter: yup.number().when("type", {
    is: "Taper",
    then: (schema) =>
      schema
        .typeError("Must be a number")
        .required("Required field")
        .min(0, "Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),

  lowerThickness: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  upperThickness: yup.number().when("type", {
    is: "Taper",
    then: (schema) =>
      schema
        .typeError("Must be a number")
        .required("Required field")
        .min(0, "Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
