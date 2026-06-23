import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

export const EightRibTypeSchema = yup.object({
  bpWidthEW: numberField,
  bpWidthNS: numberField,
  anchorPitchEW: numberField,
  anchorPitchNS: numberField,
  anchorDia: numberField,
  anchorCount: numberField,
  anchorCountTension: numberField,
  ribAngle: numberField,
  bpThickness: numberField,
  ribHeight: numberField,
  ribScallop: numberField,
  weldLeg: numberField,
  ribLength: numberField,
  ribThickness: numberField,
});
