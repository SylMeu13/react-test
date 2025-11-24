export default class APIError extends Error {
  private response: Response;

  constructor(response: Response) {
    super(`Une erreur ${response.status} a eu lieu !`);
    this.response = response;
  }

  public get errorResponse(): Response {
    return this.response;
  }

  public get statusCode(): Number {
    return this.response.status;
  }
}
