import * as Yup from "yup";

export const DrawingBaseplateSchema = Yup.object().shape({
  baseplateType: Yup.string()
    .required("Baseplate type is required")
    .oneOf(["4rib", "8rib"], "Invalid type"),
  bpWidthEW: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Baseplate Width (EW) is required")
    .positive("Value must be positive"),
});
