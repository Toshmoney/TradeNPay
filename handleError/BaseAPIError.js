class BaseAPIError extends Error {
  constructor(message) {
    return super(message);
  }
}

module.exports = BaseAPIError;
