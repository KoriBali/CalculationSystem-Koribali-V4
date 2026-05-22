// Validates form data against a Yup schema and returns { isValid, errors } formatted for UI handling
export const validateWithYup = async (schema, data, options = {}) => {
  try {
    await schema.validate(data, { abortEarly: false, ...options });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = error.inner.reduce((acc, curr) => {
      if (curr.path) acc[curr.path] = curr.message;
      return acc;
    }, {});
    return { isValid: false, errors };
  }
};
