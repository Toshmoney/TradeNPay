const BaseAPIError = require("./BaseAPIError");

class CustomAPIError extends BaseAPIError {
  constructor(
    message = "request unprocessabe",
    status = 500,
    name = "CustomAPIError"
  ) {
    super(message);
    this.statusCode = status;
    this.name = name;
  }
}

module.exports = {
  CustomAPIError,
};
