const ValidateRequestBody = (req, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      missingFields,
    };
  }

  return {
    isValid: true,
  };
};
module.exports = ValidateRequestBody;
