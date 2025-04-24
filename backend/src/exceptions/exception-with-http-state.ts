import { HasStatusCode } from './has-status-code';

/**
 * Exceptions which are associated with a HTTP error code.
 */
export abstract class ExceptionWithHttpState extends Error implements HasStatusCode {
    constructor(
        public status: number,
        public error: string
    ) {
        super(error);
    }
}
