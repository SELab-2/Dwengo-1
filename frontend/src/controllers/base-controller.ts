import { apiConfig } from "@/config.ts";

export class BaseController {
    protected baseUrl: string;

    constructor(basePath: string) {
        this.baseUrl = `${apiConfig.baseUrl}/${basePath}`;
    }

    protected async get<T>(path: string, queryParams?: Record<string, any>): Promise<T> {
        let url = `${this.baseUrl}${path}`;
        if (queryParams) {
            const query = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, value.toString());
                }
            });
            url += `?${query.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData?.error || `Error ${res.status}: ${res.statusText}`);
        }

        return res.json();
    }

    protected async post(path: string, body: unknown): Promise<void> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData?.error || `Error ${res.status}: ${res.statusText}`);
        }
    }

    protected async delete(path: string): Promise<void> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData?.error || `Error ${res.status}: ${res.statusText}`);
        }
    }

    protected async put(path: string, body: unknown): Promise<void> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData?.error || `Error ${res.status}: ${res.statusText}`);
        }
    }
}
