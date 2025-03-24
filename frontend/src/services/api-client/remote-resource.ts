import {type ShallowReactive, shallowReactive} from "vue";

export type NotLoadedState = {
    type: "notLoaded"
};
export type LoadingState = {
    type: "loading"
};
export type ErrorState = {
    type: "error",
    error: any
};
export type SuccessState<T> = {
    type: "success",
    data: T
};
export type RemoteResourceState<T> = NotLoadedState | LoadingState | ErrorState | SuccessState<T>;

export type RemoteResource<T> = ShallowReactive<{
    state: RemoteResourceState<T>
}>;

export function remoteResource<T>(): RemoteResource<T> {
    return shallowReactive({
        state: {
            type: "notLoaded"
        }
    });
}

export function loadResource<T>(resource: RemoteResource<T>, promise: Promise<T>): void {
    resource.state = { type: "loading" }
    promise.then(
        data => resource.state = { type: "success", data },
        error => resource.state = { type: "error", error }
    );
}
