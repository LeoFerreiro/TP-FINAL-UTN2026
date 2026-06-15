// Captura rechazos de funciones async y los deriva al manejador centralizado
// de errores de Express, evitando try/catch repetidos en cada controller.
export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
