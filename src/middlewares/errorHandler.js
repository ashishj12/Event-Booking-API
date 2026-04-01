export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';

  console.error(`[${status}] ${message}`, err.stack);
  res.status(status).json({ success: false, error: message });
};
