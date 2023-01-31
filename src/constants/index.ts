export const OK = 200;
export const BAD_REQUEST_ERROR = 400;
export const UNAUTHORIZED_ERROR = 401;
export const FORBIDDEN_ERROR = 403;
export const NOT_FOUND_ERROR = 404;
export const CONFLICT_ERROR = 409;
export const INTERNAL_SERVER_ERROR = 500;

export const regExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

export const { JWT_SECRET = 'super-secret-word' } = process.env;
