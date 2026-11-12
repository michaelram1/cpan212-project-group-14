export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  // Keep details client-safe. Never send internal stack traces.
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ error: { message, details: err.details ?? null } });
}
