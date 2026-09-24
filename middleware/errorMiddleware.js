import ApiError from "../core/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return ApiError.handle(err, res);
  }

  const unknownError = new ApiError(500, err.message || "Internal Server Error");
  return ApiError.handle(unknownError, res);
};

export default errorHandler;
