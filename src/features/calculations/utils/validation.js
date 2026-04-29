// Validates form data against a Yup schema and returns { isValid, errors } formatted for UI handling
export const validateWithYup = async (schema, data) => {
  try {
    // Run Yup validation (collect all errors)
    await schema.validate(data, { abortEarly: false });

    return {
      isValid: true,
      errors: {},
    };
  } catch (error) {
    // Transform Yup errors into { field: message }
    const errors = error.inner.reduce((acc, curr) => {
      if (curr.path) {
        acc[curr.path] = curr.message;
      }
      return acc;
    }, {});

    return {
      isValid: false,
      errors,
    };
  }
};
