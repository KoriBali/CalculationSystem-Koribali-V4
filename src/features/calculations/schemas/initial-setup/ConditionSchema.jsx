import * as yup from "yup";

export const ConditionSchema = yup.object({
  designStandard: yup.string().notRequired(),
  designWindSpeed: yup.mixed().notRequired(),
  designAirDensity: yup.mixed().notRequired(),
  poleType: yup.string().notRequired(),
  openingEnabled: yup.boolean(),
  baseplateEnabled: yup.boolean(),
  foundationEnabled: yup.boolean(),
});

