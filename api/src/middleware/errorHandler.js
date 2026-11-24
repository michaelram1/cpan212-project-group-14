export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === "ValidationError") {
    const details = Object.fromEntries(Object.entries(err.errors).map(([field, error]) => [field, error.message]));
    return res.status(400).json({ error: { message: "Validation failed", details } });
  }
  if (err.name === "CastError" && err.path === "_id") return res.status(404).json({ error: { message: "Not found", details: null } });
  // Keep details client-safe. Never send internal stack traces.
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ error: { message, details: err.details ?? null } });
}
