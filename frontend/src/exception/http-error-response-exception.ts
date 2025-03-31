import type {AxiosResponse} from "axios";

export class HttpErrorResponseException extends Error {
    public statusCode: number;
    constructor(public response: AxiosResponse<unknown, unknown>) {
        super((response.data as {message: string})?.message || JSON.stringify(response.data));
        this.statusCode = response.status;
    }
}
