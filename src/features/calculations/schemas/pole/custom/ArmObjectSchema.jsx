import * as yup from "yup";

export const ArmObjectSchema = yup.object({
  name: yup.string().required("Required field"),

  type: yup.string().required("Required field"),

  frontArea: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  weight: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  hDistance: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  nnC: yup
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

  sideArea: yup.number().when("type", {
    is: "directional",
    then: (schema) =>
      schema
        .typeError("Must be a number")
        .required("Required field")
        .min(0, "Must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),

  fixAngle: yup.number().when("type", {
    is: "directional",
    then: (schema) =>
      schema.typeError("Must be a number").required("Required field"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
