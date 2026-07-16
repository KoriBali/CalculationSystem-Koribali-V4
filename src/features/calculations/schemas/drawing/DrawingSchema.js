import * as yup from "yup";

export const DrawingSchema = yup.object({
  drawingType: yup.string().required("Required field"),
  surfaceTreatment: yup.string().required("Required field"),
  coatingType: yup.string().required("Required field"),
});
