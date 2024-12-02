export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: ErrorResponse
  ) {
    super(message);
    this.name = 'APIError';
  }
}
