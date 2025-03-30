import { ExceptionWithHttpState } from './exception-with-http-state.js';

/**
 * Exception for HTTP 404 Not Found
 */
export class NotFoundException extends ExceptionWithHttpState {
    public status = 404;

    constructor(error: string) {
        super(404, error);
    }
}
