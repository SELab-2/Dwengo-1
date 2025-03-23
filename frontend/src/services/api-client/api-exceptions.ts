import type {AxiosResponse} from "axios";

export class HttpErrorStatusException extends Error {
    public readonly statusCode: number;

    constructor(response: AxiosResponse<any, any>) {
        super(`${response.statusText} (${response.status})`);
        this.statusCode = response.status;
    }
}

export class NotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidResponseException extends Error {
    constructor(message: string) {
        super(message);
    }
}
