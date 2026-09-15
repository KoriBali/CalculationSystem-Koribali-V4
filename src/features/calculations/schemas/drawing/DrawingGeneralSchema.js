import * as yup from "yup";

export const DrawingGeneralSchema = yup.object({
  drawingType: yup.string().required("Drawing Type is required"),
  drawingNumber: yup.string().required("Drawing Number is required"),
  partNumber: yup.string().required("Part Number is required"),
  openingDirection: yup.string(),
  lightingCompanyName: yup.string().required("Lighting Company Name is required"),
  poleType: yup.string().when("$projectMode", {
    is: "drawing",
    then: (schema) => schema.required("Please select a pole type"),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalComponents: yup.object().shape({
    opening: yup.boolean(),
    baseplate: yup.boolean(),
    foundation: yup.boolean(),
  }),
  useCoupling: yup.boolean().required("Please select a coupling option"),
});
