import * as yup from "yup";

export const DrawingPoleSchema = yup.object({
  taperPoleStandard: yup.object().shape({
    poleType: yup.string().required("Required field"),
    groundPosition: yup.string().required("Required field"),
    height: yup.string().required("Required field"),
  }),
});
