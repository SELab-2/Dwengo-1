export class RemoteResource<T> {
    static NOT_LOADED: NotLoadedState = {type: "notLoaded"};
    static LOADING: LoadingState = {type: "loading"};

    private _state: RemoteResourceState<T> = RemoteResource.NOT_LOADED;

    constructor(private readonly requestFn: () => Promise<T>) {
    }

    public static join<T>(resources: RemoteResource<T>[]): RemoteResource<T[]> {
        return new RemoteResource(async () => {
            console.log("joined fetch");
            const promises = resources.map(it => it.request());
            const data = await Promise.all(promises);
            const failed = resources
                .filter(it => it.state.type === "error")
                .map(it => it.state as ErrorState);
            if (failed.length > 0) {
                console.log("joined error!");
                throw failed[0].error;
            }
            console.log("succ");
            console.log(data);
            return data.map(it => it!);
        });
    }

    public async request(): Promise<T | undefined> {
        this._state = RemoteResource.LOADING;
        try {
            let resource = await this.requestFn();
            this._state = {
                type: "success",
                data: resource
            };
            return resource;
        } catch (e: any) {
            this._state = {
                type: "error",
                errorCode: e.statusCode,
                message: e.message,
                error: e
            };
        }
    }

    public startRequestInBackground(): RemoteResource<T> {
        this.request().then();
        return this;
    }

    public get state(): RemoteResourceState<T> {
        return this._state;
    }

    public get data(): T | undefined {
        if (this._state.type === "success") {
            return this._state.data;
        }
    }

    public map<U>(mappingFn: (content: T) => U): RemoteResource<U> {
        return new RemoteResource<U>(async () => {
            await this.request();
            if (this._state.type === "success") {
                return mappingFn(this._state.data);
            } else if (this._state.type === "error") {
                throw this._state.error;
            } else {
                throw new Error("Fetched resource, but afterwards, it was neither in a success nor in an error state. " +
                    "This should never happen.");
            }
        });
    }
}

export type NotLoadedState = {
    type: "notLoaded"
};
export type LoadingState = {
    type: "loading"
};
export type ErrorState = {
    type: "error",
    errorCode?: number,
    message?: string,
    error: any
};
export type SuccessState<T> = {
    type: "success",
    data: T
};
export type RemoteResourceState<T> = NotLoadedState | LoadingState | ErrorState | SuccessState<T>;
