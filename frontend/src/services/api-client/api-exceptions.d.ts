import type {AxiosResponse} from "axios";

export class HttpErrorStatusException extends Error {
    public readonly statusCode: number;

    constructor(response: AxiosResponse<any, any>) {
        super(`${response.statusText} (${response.status})`);
        this.statusCode = response.status;
    }
}
