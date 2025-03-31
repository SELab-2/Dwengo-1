import { apiConfig } from "@/config.ts";
import apiClient from "@/services/api-client/api-client.ts";
import type {AxiosResponse, ResponseType} from "axios";
import {HttpErrorResponseException} from "@/exception/http-error-response-exception.ts";

export abstract class BaseController {
    protected baseUrl: string;

    protected constructor(basePath: string) {
        this.baseUrl = `${apiConfig.baseUrl}/${basePath}`;
    }

    private assertSuccessResponse(response: AxiosResponse<unknown, unknown>) {
        if (response.status / 200 !== 2) {
            throw new HttpErrorResponseException(response);
        }
    }

    protected async get<T>(path: string, queryParams?: Record<string, any>, responseType?: ResponseType): Promise<T> {
        let response = await apiClient.get<T>(path, {params: queryParams, responseType});
        this.assertSuccessResponse(response);
        return response.data;
    }

    protected async post<T>(path: string, body: unknown): Promise<T> {
        let response = await apiClient.post<T>(path, body);
        this.assertSuccessResponse(response);
        return response.data;
    }

    protected async delete<T>(path: string): Promise<T> {
        let response = await apiClient.delete<T>(path)
        this.assertSuccessResponse(response);
        return response.data;
    }

    protected async put<T>(path: string, body: unknown): Promise<T> {
        let response = await apiClient.put<T>(path, body);
        this.assertSuccessResponse(response);
        return response.data;
    }
}
