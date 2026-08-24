import * as yup from "yup";

// `condition` — need baseplateEnabled to know whether Embedment Length applies
// (only relevant when there's no baseplate and ground position is underGL).
export const TaperTypeSchema = (condition) => {
  const requiresEmbedment = !condition?.baseplateEnabled;

  return yup.object({
    poleType: yup.string().required("Please select a pole standard type"),
    groundPosition: yup.string().required("Please select a ground position"),
    height: yup.string().required("Please select a height"),
    embedmentLength: yup.string().when("groundPosition", {
      is: (val) => requiresEmbedment && val === "underGL",
      then: (schema) => schema.required("Embedment Length is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};
