export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends HttpError {
  constructor(message: string = 'Access denied') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
} 