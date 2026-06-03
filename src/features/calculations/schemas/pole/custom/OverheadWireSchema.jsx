import * as yup from "yup";

const toNumber = (_, val) =>
  val === "" || val === null ? undefined : Number(val);

export const OverheadWireSchema = yup.object({
  name: yup.string().required("Required field"),

  weight: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  diameter: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  zHeight: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  span: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  saggingRatio: yup
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

  fixAngle: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field"),

  verticalAngle: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field"),
});
