import * as yup from "yup";

export const DrawingPoleSchema = yup.object({
  taperPoleStandard: yup.object().shape({
    poleType: yup.string().required("Please select a pole standard type"),
    groundPosition: yup.string().required("Please select a ground position"),
    height: yup.string().required("Please select a height"),
  }),
});
