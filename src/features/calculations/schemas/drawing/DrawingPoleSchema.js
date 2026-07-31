import * as yup from "yup";

export const DrawingPoleSchema = yup.object({
  poleType: yup.string().required("Select a pole type").oneOf(["lighting-pole", "custom"]),
  taperPoleStandard: yup.object().when("poleType", {
    is: "lighting-pole",
    then: () => yup.object().shape({
      poleType: yup.string().required("Required field"),
      groundPosition: yup.string().required("Required field"),
      height: yup.string().required("Required field"),
    }),
    otherwise: () => yup.object(),
  }),
});
