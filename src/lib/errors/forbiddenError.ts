class forbiddenError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = 'forbiddenError';
    this.status = 403;
  }
}

export default forbiddenError;
