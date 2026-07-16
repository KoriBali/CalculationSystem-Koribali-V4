import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .required("Required field")
  .min(0, "Must be positive");

const optionalNumberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .min(0, "Must be positive")
  .nullable()
  .optional();

export const FourRibTypeSchema = yup.object({
  bpWidthEW: numberField,
  bpWidthNS: optionalNumberField,
  anchorPitchEW: numberField,
  anchorPitchNS: optionalNumberField,
  anchorDia: numberField,
  anchorCount: optionalNumberField,
  anchorCountTension: optionalNumberField,
  bpThickness: numberField,
  ribHeight: numberField,
  ribScallop: numberField,
  weldLeg: numberField,
  ribLength: numberField,
  ribThickness: numberField,
});
