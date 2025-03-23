import { HttpException } from './httpException.js';

/**
 * Exception for HTTP 404 Not Found
 */
export class NotFoundException extends HttpException {
    constructor(message: string = 'Not Found') {
        super(404, message);
    }
}
