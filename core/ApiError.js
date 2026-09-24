class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  static handle(err, res) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      details: err.details || null,
    });
  }
}

export default ApiError;
