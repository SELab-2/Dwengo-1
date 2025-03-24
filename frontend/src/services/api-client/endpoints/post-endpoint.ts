import {type Params, RestEndpoint} from "@/services/api-client/endpoints/rest-endpoint.ts";

export class PostEndpoint<PP extends Params, QP extends Params, B, R> extends RestEndpoint<PP, QP, B, R> {
    readonly method = "POST";

    public post(pathParams: PP, queryParams: QP, body: B): Promise<R> {
        return super.request(pathParams, queryParams, body);
    }
}
