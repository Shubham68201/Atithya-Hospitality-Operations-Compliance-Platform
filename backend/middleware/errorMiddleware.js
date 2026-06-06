export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  // Ensure CORS headers are present even on error responses,
  // otherwise the browser blocks the response and shows a CORS error
  // instead of the actual error message.
  const origin = req.headers.origin;
  const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_2,
  ].filter(Boolean);
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") { statusCode = 404; message = "Resource not found"; }
  if (err.name === "ValidationError") { statusCode = 400; message = Object.values(err.errors).map(e => e.message).join(", "); }
  if (err.code === 11000) { statusCode = 400; const field = Object.keys(err.keyValue)[0]; message = `${field} already exists`; }
  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token"; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired"; }
  res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === "development" && { stack: err.stack }) });
};

