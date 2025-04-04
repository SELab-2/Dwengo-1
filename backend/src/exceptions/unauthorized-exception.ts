import { ExceptionWithHttpState } from './exception-with-http-state.js';

/**
 * Exception for HTTP 401 Unauthorized
 */
export class UnauthorizedException extends ExceptionWithHttpState {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
