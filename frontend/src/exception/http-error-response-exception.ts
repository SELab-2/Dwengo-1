import type {AxiosResponse} from "axios";

export class HttpErrorResponseException extends Error {
    constructor(public response: AxiosResponse<unknown, unknown>) {
        super(response.statusText);
    }
}
