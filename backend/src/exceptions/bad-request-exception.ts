import {ExceptionWithHttpState} from "./exception-with-http-state.js";

/**
 * Exception for HTTP 400 Bad Request
 */
export class BadRequestException extends ExceptionWithHttpState {
    constructor(error: string) {
        super(400, error);
    }
}
