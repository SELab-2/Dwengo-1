export class UnauthorizedException extends Error {
    status = 401;
    constructor(message: string = 'Unauthorized') {
        super(message);
    }
}

export class ForbiddenException extends Error {
    status = 403;
    constructor(message: string = 'Forbidden') {
        super(message);
    }
}
