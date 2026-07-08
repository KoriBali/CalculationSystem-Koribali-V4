import * as yup from "yup";

export const CoverSchema = yup.object({
  managementCode: yup.string().required("Required field"),
  calculationNumber: yup.string().required("Required field"),
  projectName: yup.string().required("Required field"),
  withDrawing: yup.boolean(),
  withReport: yup.boolean(),
  coverTopText: yup.string(),
  coverBottomText: yup.string(),
  date: yup.string().required("Required field"),
});
