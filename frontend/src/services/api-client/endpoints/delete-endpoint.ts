import {type Params, RestEndpoint} from "@/services/api-client/endpoints/rest-endpoint.ts";

export class DeleteEndpoint<PP extends Params, QP extends Params, R> extends RestEndpoint<PP, QP, undefined, R> {
    readonly method = "GET";

    public delete(pathParams: PP, queryParams: QP): Promise<R> {
        return super.request(pathParams, queryParams, undefined);
    }
}
