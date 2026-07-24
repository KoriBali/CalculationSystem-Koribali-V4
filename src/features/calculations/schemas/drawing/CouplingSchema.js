import * as yup from "yup";

const numberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("*Must be a number")
  .required("*Required field")
  .min(0, "*Must be positive");

export const CouplingSchema = yup.object().shape({
  location: yup.string().required("*Required field"),
  couplings: yup.array().of(
    yup.object().shape({
      height: numberField.test(
        "is-less-than-previous",
        "Must be less than previous height",
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
                  return this.createError({ message: `*Must be < H${idx}` });
                }
              }
            }
          }
          return true;
        }
      ),
      withHookband: yup.boolean(),
      caseDetails: yup
        .object()
        .shape({
          caseId: yup.number().required("*Required field"),
          position: yup.string().required("*Required field"),
          size: yup.string().required("*Required field"),
          type: yup.string().required("*Required field"),
          verticalAngle: numberField,
        })
        .nullable()
        .required("*Please configure coupling details"),
    })
  ),
});
