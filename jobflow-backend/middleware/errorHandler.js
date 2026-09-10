// middleware/errorHandler.js
// Catches any error thrown/passed via next(err) in the app and returns
// a clean JSON response instead of crashing the server.
function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err.message);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = errorHandler;
