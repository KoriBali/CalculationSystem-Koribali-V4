import * as yup from "yup";

export const CoverSchema = yup.object({
  reportNumber: yup.string().required("Required field"),
  title1: yup.string().required("Required field"),
  title2: yup.string(),
  title3: yup.string(),
  designRequestManagementNo: yup.string().required("Required field"),
  region: yup.string().required("Required field"),
  author: yup.string().required("Required field"),
  departmentInCharge: yup.string().required("Required field"),
});
