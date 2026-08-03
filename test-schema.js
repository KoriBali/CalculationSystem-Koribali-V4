import * as yup from "yup";

const validateWithYup = async (schema, data, options = {}) => {
  try {
    await schema.validate(data, { abortEarly: false, ...options });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.inner && error.inner.length > 0) {
      error.inner.forEach((curr) => {
        if (curr.path) errors[curr.path] = curr.message;
      });
    } else if (error.path !== undefined) {
      errors[error.path] = error.message;
    }
    return { isValid: false, errors, msg: error.message };
  }
};

const optionalNumberField = yup
  .number()
  .transform((_, val) => (val === "" ? undefined : Number(val)))
  .typeError("Must be a number")
  .nullable()
  .notRequired();

const StraightTypeSchema = (condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;

  return yup.object({
    upperThickness: yup.number().required("Required field"),
    upperLength: yup.number().typeError("Must be a number").required("Required field").min(0, "Must be positive"),
    lowerThickness: yup.number().required("Required field"),
    lowerLength: yup.number().typeError("Must be a number").required("Required field").min(0, "Must be positive"),
    
    embedmentLength: optionalNumberField.when([], {
      is: () => isEmbedment,
      then: (schema) => schema.required("Required field"),
    }),
    
    groundPosition: yup.string().when([], {
      is: () => isBase,
      then: (schema) => schema.required("Required field"),
      otherwise: (schema) => schema.notRequired(),
    }),
    
    heightDepth: optionalNumberField.when("groundPosition", {
      is: (val) => isBase && val === "underGL",
      then: (schema) => schema.required("Required field").lessThan(0, "Value must be less than 0"),
    }),
  });
};

const run = async () => {
  const condition = { baseplateEnabled: true };
  const data = {
    upperThickness: "4",
    upperLength: "1000",
    lowerThickness: "5",
    lowerLength: "2000",
    embedmentLength: "",
    groundPosition: "onGL",
    heightDepth: "0"
  };
  
  const res = await validateWithYup(StraightTypeSchema(condition), data);
  console.log("TEST 1 - filled baseplate:", JSON.stringify(res, null, 2));

  data.groundPosition = "underGL";
  data.heightDepth = "";
  const res2 = await validateWithYup(StraightTypeSchema(condition), data);
  console.log("TEST 2 - missing heightDepth:", JSON.stringify(res2, null, 2));

  data.heightDepth = "5";
  const res3 = await validateWithYup(StraightTypeSchema(condition), data);
  console.log("TEST 3 - invalid positive heightDepth:", JSON.stringify(res3, null, 2));
};

run();
