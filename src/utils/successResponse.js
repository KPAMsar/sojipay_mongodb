class SuccessResponse {
  constructor(message, data, statusCode) {
    this.success = true;
    this.message = message;
    this.data = data || null;
    this.code = statusCode;
  }
}

module.exports = SuccessResponse;
