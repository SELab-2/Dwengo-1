import { HttpException } from './httpException.js';

/**
 * Exception for HTTP 400 Bad Request
 */

export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
