/**
 * This function extracts the error message from the result of Joi validation.
 * @param {Object} validateResult - The object that returns from schema.validate()
 * @returns {string|null} - Returns the error message or null if everything is fine
 */

export const getJoiErrorMessage = (validateResult) => {
  if (validateResult?.error) {
    return validateResult.error.details[0].message;
  }
  return null;
};