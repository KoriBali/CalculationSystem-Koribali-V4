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
      // After refactoring, caseDetails has the shape:
      //   { caseId, cp1: { position, size, type, verticalAngle, ... }, cp2?: { ... } }
      // Field-level validation (position, size, type, verticalAngle) is handled
      // inside CouplingCaseFormModal before the data is saved here.
      // This schema only verifies that caseDetails exists and has a valid caseId + cp1.
      caseDetails: yup
        .object()
        .shape({
          caseId: yup.number().required("*Coupling case is required"),
          cp1: yup
            .object()
            .required("*Coupling 1 details are required")
            .test(
              "cp1-has-required-fields",
              "*Please complete Coupling 1 configuration",
              (val) =>
                val != null &&
                val.position !== "" &&
                val.size !== "" &&
                val.type !== "" &&
                val.verticalAngle !== "" &&
                val.verticalAngle != null
            ),
        })
        .nullable()
        .required("*Please configure coupling details"),
    })
  ),
});
