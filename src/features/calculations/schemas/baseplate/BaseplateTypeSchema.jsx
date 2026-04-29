import * as yup from "yup";

export const BaseplateTypeSchema = yup.object({
  type: yup.string().required("Required field"),
});
