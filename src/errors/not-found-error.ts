import { NOT_FOUND_ERROR } from '../constants/index';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
  }
}
export default NotFoundError;
