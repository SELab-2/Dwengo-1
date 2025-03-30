import { ExceptionWithHttpState } from './exception-with-http-state.js';

/**
 * Exception for HTTP 409 Conflict
 */
export class ConflictException extends ExceptionWithHttpState {
    public status = 409;

    constructor(error: string) {
        super(409, error);
    }
}
