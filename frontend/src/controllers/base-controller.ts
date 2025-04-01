import apiClient from "@/services/api-client/api-client.ts";
import type {AxiosResponse, ResponseType} from "axios";
import {HttpErrorResponseException} from "@/exception/http-error-response-exception.ts";

export abstract class BaseController {
    protected basePath: string;

    protected constructor(basePath: string) {
        this.basePath = basePath;
    }

    private static assertSuccessResponse(response: AxiosResponse<unknown, unknown>): void {
        if (response.status / 100 !== 2) {
            throw new HttpErrorResponseException(response);
        }
    }

    protected async get<T>(path: string, queryParams?: QueryParams, responseType?: ResponseType): Promise<T> {
        const response = await apiClient.get<T>(
            this.absolutePathFor(path),
            {params: queryParams, responseType}
        );
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    protected async post<T>(path: string, body: unknown): Promise<T> {
        const response = await apiClient.post<T>(this.absolutePathFor(path), body);
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    protected async delete<T>(path: string): Promise<T> {
        const response = await apiClient.delete<T>(this.absolutePathFor(path))
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    protected async put<T>(path: string, body: unknown): Promise<T> {
        const response = await apiClient.put<T>(this.absolutePathFor(path), body);
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    private absolutePathFor(path: string): string {
        return "/" + this.basePath + path;
    }
}

type QueryParams = Record<string, string | number | boolean | undefined>;
