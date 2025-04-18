import { ExceptionWithHttpState } from './exception-with-http-state.js';

/**
 * Exception for HTTP 500 Internal Server Error
 */
export class ServerErrorException extends ExceptionWithHttpState {
    status = 500;

    constructor(message = 'Internal server error, something went wrong') {
        super(500, message);
    }
}
