import * as yup from "yup";

const numberField = (label) =>
  yup
    .number()
    .transform((_, val) => (val === "" ? undefined : Number(val)))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be positive`);

export const SquareCaissonTypeSchema = yup.object({
  foundationWidthX: numberField("Foundation Width (X)"),
  foundationWidthY: numberField("Foundation Width (Y)"),
  embedmentDepth: numberField("Embedment Depth"),
  nValue: numberField("N Value"),
  yValue: numberField("γ Value"),
  ycValue: numberField("γc Value"),
  alphaValue: numberField("α Value"),
});
