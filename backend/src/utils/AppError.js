// Error controlado de la aplicación. Permite enviar código HTTP y detalles al
// middleware centralizado sin perder el mensaje original.
export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
