import {RemoteResource} from "@/services/api-client/remote-resource.ts";
import apiClient from "@/services/api-client/api-client.ts";
import {HttpErrorStatusException} from "@/services/api-client/api-exceptions";

export abstract class RestEndpoint<PP extends Params, QP extends Params, B, R> {
    public abstract readonly method: "GET" | "POST" | "PUT" | "DELETE";
    constructor(public readonly url: string) {
    }

    protected request(pathParams: PP, queryParams: QP, body: B): RemoteResource<R> {
        let urlFilledIn = this.url;
        urlFilledIn.replace(/:(\w+)([/$])/g, (_, key, after) =>
            (key in pathParams ? encodeURIComponent(pathParams[key]) : `:${key}`) + after
        );
        return new RemoteResource(async () => {
            const response = await apiClient.request<R>({
                url: urlFilledIn,
                method: this.method,
                params: queryParams,
                data: body,
            });
            if (response.status / 100 !== 2) {
                throw new HttpErrorStatusException(response);
            }
            return response.data;
        });
    }
}

export type Params = {[key: string]: string | number | boolean};
