import * as yup from "yup";

const numberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be positive`);

const optionalNumberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .min(0, `${label} must be positive`)
    .nullable()
    .optional();

export const FourRibTypeSchema = yup.object({
  bpWidthEW: numberField("Baseplate Width (EW)"),
  bpWidthNS: optionalNumberField("Baseplate Width (NS)"),
  anchorPitchEW: numberField("Anchor Pitch (EW)"),
  anchorPitchNS: optionalNumberField("Anchor Pitch (NS)"),
  anchorDia: numberField("Anchor Bolt Diameter"),
  anchorCount: optionalNumberField("Number of Anchor Bolts"),
  anchorCountTension: optionalNumberField(
    "Number of Anchor Bolts on Tension Side",
  ),
  bpThickness: numberField("Baseplate Thickness"),
  ribHeight: numberField("Rib Plate Height"),
  ribScallop: numberField("Rib Plate Scallop"),
  weldLeg: numberField("Weld Leg Length"),
  ribLength: numberField("Rib Plate Length"),
  ribThickness: numberField("Rib Plate Thickness"),
});
