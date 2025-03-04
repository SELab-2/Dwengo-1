/**
 * Exception for HTTP 400 Bad Request
 */
export class BadRequestException extends Error {
    public status = 400;

    constructor(error: string) {
        super(error);
    }
}

/**
 * Exception for HTTP 404 Not Found
 */
export class NotFoundException extends Error {
    public status = 404;

    constructor(error: string) {
        super(error);
    }
}
