export class DBError extends Error {
  statusCode = 500;

  constructor(public message: string) {
    super(`[DBError]: ${message}`);
  }

  serializeError() {
    return { message: this.message };
  }
}
