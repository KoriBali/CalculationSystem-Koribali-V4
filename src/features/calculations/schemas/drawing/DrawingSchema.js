import * as yup from "yup";

export const DrawingSchema = yup.object({
  drawingType: yup.string(),
  surfaceTreatmentType: yup.string().required("Required field"),
  platingType: yup.string().required("Required field"),
  specificPlatingTypeCode: yup.string(),
  paintingType: yup.string().when("surfaceTreatmentType", {
    is: "Plating + Painting",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  }),
  colorName: yup.string().when("paintingType", {
    is: "Specified Color Paint",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  }),
  munsellValue: yup.string().when("paintingType", {
    is: "Specified Color Paint",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  }),
  colorCode: yup.string().when("paintingType", {
    is: "Specified Color Paint",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  }),
});
