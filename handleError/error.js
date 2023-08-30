const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  const errorResponse = {
    message: err?.message || "something went wrong please, try again",
    statusCode: err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "ValidationError") {
    errorResponse.statusCode = 400;
  }

  if (err.name === "CastError") {
    errorResponse.statusCode = 404;
  }

  if (err.code && err.code === 11000) {
    const value = Object.values(err.keyValue);
    const field = Object.keys(err.keyValue);
    errorResponse.message = `duplicate value:${value} for field:${field}`;
    errorResponse.statusCode = 400;
  }

  return res.status(errorResponse.statusCode).json({
    message: errorResponse.message,
    success: false,
  });
};

module.exports = errorHandler;
