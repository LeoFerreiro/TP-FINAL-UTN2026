export function notFound(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode || (error.name === "CastError" ? 400 : 500);
  const message = status === 500 ? "Ocurrió un error interno" : error.message;
  if (status === 500) console.error(error);
  res.status(status).json({ message, details: error.details });
}
