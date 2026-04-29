import * as yup from "yup";

export const OverheadWireSchema = yup.object({
  name: yup.string().required("Required field"),

  weight: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  diameter: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  zHeight: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  span: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  saggingRatio: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  nnC: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  fixAngle: yup
    .number()
    .typeError("Must be a number")
    .required("Required field"),

  verticalAngle: yup
    .number()
    .typeError("Must be a number")
    .required("Required field"),
});
