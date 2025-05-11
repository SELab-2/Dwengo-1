import apiClient from "@/services/api-client/api-client.ts";
import type { AxiosResponse, ResponseType } from "axios";
import { HttpErrorResponseException } from "@/exception/http-error-response-exception.ts";
import { apiConfig } from "@/config.ts";

export abstract class BaseController {
    protected basePath: string;

    protected constructor(basePath: string) {
        this.basePath = basePath;
    }

    private static assertSuccessResponse(response: AxiosResponse<unknown, unknown>): void {
        if (response.status < 200 || response.status >= 300) {
            throw new HttpErrorResponseException(response);
        }
    }

    protected async get<T>(path: string, queryParams?: QueryParams, responseType?: ResponseType): Promise<T> {
        try {
            const response = await apiClient.get<T>(this.absolutePathFor(path), { params: queryParams, responseType });
            BaseController.assertSuccessResponse(response);
            return response.data;
        } catch (error) {
            if (error instanceof HttpErrorResponseException) {
                throw error;
            }
            throw new Error(
                `An unexpected error occurred while fetching data from ${apiConfig.baseUrl}${this.absolutePathFor(path)}: ${error}`,
            );
        }
    }

    protected async post<T>(path: string, body: unknown, queryParams?: QueryParams): Promise<T> {
        const response = await apiClient.post<T>(this.absolutePathFor(path), body, { params: queryParams });
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    /**
     * Sends a POST-request with a form-data body with the given file.
     *
     * @param path Relative path in the api to send the request to.
     * @param formFieldName The name of the form field in which the file should be.
     * @param file The file to upload.
     * @param queryParams The query parameters.
     * @returns The response the POST request generated.
     */
    protected async postFile<T>(path: string, formFieldName: string, file: File, queryParams?: QueryParams): Promise<T> {
        const formData = new FormData();
        formData.append(formFieldName, file);
        const response = await apiClient.post<T>(this.absolutePathFor(path), formData, {
            params: queryParams,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        BaseController.assertSuccessResponse(response)
        return response.data;
    }

    protected async delete<T>(path: string, queryParams?: QueryParams): Promise<T> {
        const response = await apiClient.delete<T>(this.absolutePathFor(path), { params: queryParams });
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    protected async put<T>(path: string, body: unknown, queryParams?: QueryParams): Promise<T> {
        const response = await apiClient.put<T>(this.absolutePathFor(path), body, { params: queryParams });
        BaseController.assertSuccessResponse(response);
        return response.data;
    }

    private absolutePathFor(path: string): string {
        return "/" + this.basePath + path;
    }
}

type QueryParams = Record<string, string | number | boolean | undefined>;
