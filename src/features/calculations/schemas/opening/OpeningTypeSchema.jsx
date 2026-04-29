import * as yup from "yup";

export const OpeningTypeSchema = yup.object({
  type: yup.string().required("Required field"),
});
