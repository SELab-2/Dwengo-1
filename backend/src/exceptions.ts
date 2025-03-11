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
 * Exception for HTTP 401 Unauthorized
 */
export class UnauthorizedException extends Error {
    status = 401;
    constructor(message: string = 'Unauthorized') {
        super(message);
    }
}

/**
 * Exception for HTTP 403 Forbidden
 */
export class ForbiddenException extends Error {
    status = 403;

    constructor(message: string = 'Forbidden') {
        super(message);
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
