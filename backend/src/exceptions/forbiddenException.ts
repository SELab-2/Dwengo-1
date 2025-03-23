import { HttpException } from './httpException.js';

/**
 * Exception for HTTP 403 Forbidden
 */
export class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}
