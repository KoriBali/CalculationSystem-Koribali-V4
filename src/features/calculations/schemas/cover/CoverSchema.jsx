import * as yup from "yup";

export const CoverSchema = yup.object({
  managementCode: yup.string().required("Required field"),
  calculationNumber: yup.string().required("Required field"),
  line1: yup.string().required("Required field"),
  date: yup.date().required("Required field"),
});
