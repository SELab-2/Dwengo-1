import { ExceptionWithHttpState } from './exception-with-http-state.js';

/**
 * Exception for HTTP 403 Forbidden
 */
export class ForbiddenException extends ExceptionWithHttpState {
    status = 403;

    constructor(message = 'Forbidden') {
        super(403, message);
    }
}
