export class RemoteResource<T> {
    static NOT_LOADED: NotLoadedState = {type: "notLoaded"};
    static LOADING: LoadingState = {type: "loading"};

    private state: NotLoadedState | LoadingState | ErrorState | SuccessState<T> = RemoteResource.NOT_LOADED;

    constructor(private readonly requestFn: () => Promise<T>) {
    }

    public async request(): Promise<T | undefined> {
        this.state = RemoteResource.LOADING;
        try {
            let resource = await this.requestFn();
            this.state = {
                type: "success",
                data: resource
            };
            return resource;
        } catch (e: any) {
            this.state = {
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

    public get data(): T | undefined {
        if (this.state.type === "success") {
            return this.state.data;
        }
    }

    public map<U>(mappingFn: (content: T) => U): RemoteResource<U> {
        return new RemoteResource<U>(async () => {
            await this.request();
            if (this.state.type === "success") {
                return mappingFn(this.state.data);
            } else if (this.state.type === "error") {
                throw this.state.error;
            } else {
                throw new Error("Fetched resource, but afterwards, it was neither in a success nor in an error state. " +
                    "This should never happen.");
            }
        });
    }
}

type NotLoadedState = {
    type: "notLoaded"
};
type LoadingState = {
    type: "loading"
};
type ErrorState = {
    type: "error",
    errorCode?: number,
    message?: string,
    error: any
};
type SuccessState<T> = {
    type: "success",
    data: T
}
