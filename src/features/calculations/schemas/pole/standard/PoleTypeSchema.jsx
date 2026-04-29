import * as yup from "yup";

export const PoleTypeSchema = yup.object({
  type: yup.string().required("Required field"),
});
