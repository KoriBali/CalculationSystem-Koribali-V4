import * as Yup from "yup";

export const DrawingBaseplateSchema = Yup.object().shape({
  baseplateType: Yup.string().required("Baseplate Type is required"),
  bpWidthEW: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Baseplate Width (EW) is required")
    .positive("Baseplate Width (EW) must be positive"),
});
