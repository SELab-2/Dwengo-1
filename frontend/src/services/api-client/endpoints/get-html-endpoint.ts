import {type Params, RestEndpoint} from "@/services/api-client/endpoints/rest-endpoint.ts";
import {RemoteResource} from "@/services/api-client/remote-resource.ts";

export class GetHtmlEndpoint<PP extends Params, QP extends Params> extends RestEndpoint<PP, QP, undefined, Document> {
    readonly method: "GET" | "POST" | "PUT" | "DELETE" = "GET";

    public get(pathParams: PP, queryParams: QP): RemoteResource<Document> {
        return super.request(pathParams, queryParams, undefined, "document");
    }
}
