export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message = 'Requête invalide', code = 'BAD_REQUEST', details?: any) {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = 'Accès non autorisé', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  static forbidden(message = 'Permission refusée', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  static notFound(message = 'Ressource introuvable', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }

  static conflict(message = 'Conflit de ressource', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }
}
