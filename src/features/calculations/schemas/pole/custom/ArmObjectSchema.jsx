import * as yup from "yup";

const toNumber = (_, val) =>
  val === "" || val === null ? undefined : Number(val);

export const ArmObjectSchema = yup.object({
  name: yup.string().required("Required field"),

  type: yup.string().required("Required field"),

  frontArea: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  weight: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  hDistance: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  nnC: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  quantity: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .integer("Must be a whole number")
    .min(1, "Value must be greater than 0"),

  sideArea: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .when("type", {
      is: "directional",
      then: (schema) =>
        schema.required("Required field").min(0, "Must be positive"),
      otherwise: (schema) => schema.notRequired(),
    }),

  fixAngle: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .when("type", {
      is: "directional",
      then: (schema) => schema.required("Required field"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
