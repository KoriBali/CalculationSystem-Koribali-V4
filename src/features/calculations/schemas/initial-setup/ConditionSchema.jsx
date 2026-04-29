import * as yup from "yup";

export const ConditionSchema = yup.object({
  designStandard: yup.string().required("Required field"),

  designWindSpeed: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  designAirDensity: yup
    .number()
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  poleType: yup.string().required("Required field"),
});
