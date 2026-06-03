// Validates form data against a Yup schema and returns { isValid, errors } formatted for UI handling
export const validateWithYup = async (schema, data, options = {}) => {
  try {
    await schema.validate(data, { abortEarly: false, ...options });
    return { isValid: true, errors: {} };
  } catch (error) {
    // error.inner berisi errors dari field biasa (abortEarly: false)
    // tapi error dari .test() custom dengan createError() masuk ke error.path langsung
    const errors = {};

    if (error.inner && error.inner.length > 0) {
      // Kasus normal: multiple field errors
      error.inner.forEach((curr) => {
        if (curr.path) errors[curr.path] = curr.message;
      });
    } else if (error.path !== undefined) {
      // Kasus .test() custom: single error dengan path langsung
      errors[error.path] = error.message;
    }

    return { isValid: false, errors };
  }
};
