const { AppError } = require("./AppError");

function errorMiddleware(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { message: "Internal Server Error", code: "INTERNAL_ERROR" },
  });
}

module.exports = { errorMiddleware };