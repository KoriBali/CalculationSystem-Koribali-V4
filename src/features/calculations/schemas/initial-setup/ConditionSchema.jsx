import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

export const ConditionSchema = yup.object({
  designStandard: yup.string().required("Required field"),
  designWindSpeed: numberField,
  designAirDensity: numberField,
  poleType: yup.string().when("$projectType", {
    is: "lighting-pole",
    then: (s) => s.required("*Required field"),
    otherwise: (s) => s.notRequired(),
  }),
});
