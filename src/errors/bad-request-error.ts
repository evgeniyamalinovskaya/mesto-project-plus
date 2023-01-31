import { BAD_REQUEST_ERROR } from '../constants/index';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}

export default BadRequestError;
