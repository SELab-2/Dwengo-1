import { HttpException } from './httpException.js';

/**
 * Exception for HTTP 401 Unauthorized
 */
export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
