import * as yup from "yup";

// "couplings[2].height" -> "Height 3"
const heightLabel = (path) => {
  const match = path?.match(/couplings\[(\d+)\]\.height/);
  return match ? `Height ${parseInt(match[1], 10) + 1}` : "Height";
};

const heightField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError(({ path }) => `*${heightLabel(path)} must be a number`)
  .required(({ path }) => `*${heightLabel(path)} is required`)
  .min(0, ({ path }) => `*${heightLabel(path)} must be positive`)
  .test(
    "is-less-than-previous",
    "*Must be less than previous height",
    function (val) {
      if (val === undefined || val === null || val === "") return true;
      const match = this.path.match(/couplings\[(\d+)\]\.height/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (idx > 0 && this.from && this.from[1]) {
          const couplings = this.from[1].value.couplings;
          if (couplings && couplings[idx - 1]) {
            const prev = couplings[idx - 1].height;
            if (prev !== undefined && prev !== "" && val >= Number(prev)) {
              return this.createError({
                message: `*${heightLabel(this.path)} must be less than Height ${idx}`,
              });
            }
          }
        }
      }
      return true;
    }
  );

export const CouplingSchema = yup.object().shape({
  location: yup.string().required("*Please select a project location"),
  couplings: yup.array().of(
    yup.object().shape({
      height: heightField,
      withHookband: yup.boolean(),
      caseDetails: yup
        .object()
        .shape({
          caseId: yup.number().required("*Coupling case is required"),
          position: yup.string().required("*Coupling position is required"),
          size: yup.string().required("*Coupling size is required"),
          type: yup.string().required("*Coupling type is required"),
          verticalAngle: yup
            .number()
            .transform((_, val) => (val === "" ? undefined : Number(val)))
            .typeError("*Vertical angle must be a number")
            .required("*Vertical angle is required")
            .min(0, "*Vertical angle must be positive"),
        })
        .nullable()
        .required("*Please configure coupling details"),
    })
  ),
});
