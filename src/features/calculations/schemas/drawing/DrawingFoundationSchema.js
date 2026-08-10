import * as yup from "yup";

const squareCaissonSchema = yup.object().shape({
  foundationWidthX: yup.string().required("Width X is required"),
  foundationWidthY: yup.string().required("Width Y is required"),
  embedmentDepth: yup.string().required("Embedment Depth is required"),
  nValue: yup.string().required("N Value is required"),
  yValue: yup.string().required("γ Value is required"),
  ycValue: yup.string().required("γc Value is required"),
  alphaValue: yup.string().required("α Value is required"),
});

const roundCaissonSchema = yup.object().shape({
  foundationWidthY: yup.string().required("Foundation Width is required"),
  embedmentDepth: yup.string().required("Embedment Depth is required"),
  nValue: yup.string().required("N Value is required"),
  yValue: yup.string().required("γ Value is required"),
  ycValue: yup.string().required("γc Value is required"),
  alphaValue: yup.string().required("α Value is required"),
});

export const DrawingFoundationSchema = yup.object().shape({
  foundationType: yup.object().shape({
    type: yup.string().required("Foundation type is required"),
  }),
  squareCaisson: yup.object().when("foundationType.type", {
    is: "square-caisson",
    then: () => squareCaissonSchema,
    otherwise: () => yup.object(),
  }),
  roundCaisson: yup.object().when("foundationType.type", {
    is: "round-caisson",
    then: () => roundCaissonSchema,
    otherwise: () => yup.object(),
  }),
});
