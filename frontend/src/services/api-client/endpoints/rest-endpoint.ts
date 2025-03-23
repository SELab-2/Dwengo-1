import {RemoteResource} from "@/services/api-client/remote-resource.ts";
import apiClient from "@/services/api-client/api-client.ts";
import {HttpErrorStatusException} from "@/services/api-client/api-exceptions.ts";
import type {ResponseType} from "axios";

export abstract class RestEndpoint<PP extends Params, QP extends Params, B, R> {
    public abstract readonly method: "GET" | "POST" | "PUT" | "DELETE";
    constructor(public readonly url: string) {
    }

    protected request(pathParams: PP, queryParams: QP, body: B, responseType?: ResponseType): RemoteResource<R> {
        let urlFilledIn = this.url.replace(/:(\w+)(\/|$)/g, (_, key, after) =>
            (pathParams[key] ? encodeURIComponent(pathParams[key]) : `:${key}`) + after
        );
        console.log(this.url);
        console.log(/:(\w+)(\W|$)/g.test(this.url))
        console.log(pathParams);
        console.log("--> filled in: " + urlFilledIn);
        return new RemoteResource(async () => {
            const response = await apiClient.request<R>({
                url: urlFilledIn,
                method: this.method,
                params: queryParams,
                data: body,
                responseType: responseType || 'json'
            });
            if (response.status / 100 !== 2) {
                throw new HttpErrorStatusException(response);
            }
            return response.data;
        });
    }
}

export type Params = {[key: string]: string | number | boolean | undefined};
