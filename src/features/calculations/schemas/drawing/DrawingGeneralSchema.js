import * as yup from "yup";

export const DrawingGeneralSchema = yup.object({
  drawingType: yup.string().required("Required field"),
  drawingNumber: yup.string().required("Required field"),
  partNumber: yup.string().required("Required field"),
  designerName: yup.string().required("Required field"),
  checkedByName: yup.string().required("Required field"),
  approvedByName: yup.string().required("Required field"),
  openingDirection: yup.string(),
  lightingCompanyName: yup.string().required("Required field"),
  poleType: yup.string().when("$projectMode", {
    is: "drawing",
    then: (schema) => schema.required("Please select pole type"),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalComponents: yup.object().shape({
    opening: yup.boolean(),
    baseplate: yup.boolean(),
    foundation: yup.boolean(),
  }),
  useCoupling: yup.boolean().required("Required field"),
});
