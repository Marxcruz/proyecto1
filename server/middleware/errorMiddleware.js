class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Error Interno del Servidor";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Valor duplicado en ${Object.keys(err.keyValue)}`,
      err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Token de autenticación inválido. ¡Inténtelo de nuevo!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `El token de autenticación ha expirado. ¡Inténtelo de nuevo!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    const message = `${err.path} inválido`,
      err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
