import * as yup from "yup";

const numberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be positive`);

export const ConditionSchema = yup.object({
  designStandard: yup.string().required("Design Standard is required"),
  designWindSpeed: numberField("Design Wind Speed"),
  designAirDensity: numberField("Air Density"),
  poleType: yup.string().when("$projectType", {
    is: "lighting-pole",
    then: (s) => s.required("*Please select a pole type"),
    otherwise: (s) => s.notRequired(),
  }),
});
