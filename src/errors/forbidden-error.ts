import { FORBIDDEN_ERROR } from '../constants';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
