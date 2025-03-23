import {type Params, RestEndpoint} from "@/services/api-client/endpoints/rest-endpoint.ts";
import {RemoteResource} from "@/services/api-client/remote-resource.ts";

export class GetEndpoint<PP extends Params, QP extends Params, R> extends RestEndpoint<PP, QP, undefined, R> {
    readonly method = "GET";

    public get(pathParams: PP, queryParams: QP): RemoteResource<R> {
        return super.request(pathParams, queryParams, undefined);
    }
}
