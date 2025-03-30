/**
 * Exceptions which are associated with a HTTP error code.
 */
export abstract class ExceptionWithHttpState extends Error {
    constructor(
        public status: number,
        public error: string
    ) {
        super(error);
    }
}
