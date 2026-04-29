import * as yup from "yup";

export const FoundationTypeSchema = yup.object({
  type: yup.string().required("Required field"),
});
