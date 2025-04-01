import axios, { AxiosRequestConfig } from 'axios';
import { getLogger, Logger } from '../logging/initalize.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';

const logger: Logger = getLogger();

/**
 * Utility function to fetch data from an API endpoint with error handling.
 * Logs errors but does NOT throw exceptions to keep the system running.
 *
 * @param url The API endpoint to fetch from.
 * @param description A short description of what is being fetched (for logging).
 * @param options Contains further options such as params (the query params) and responseType (whether the response
 *                should be parsed as JSON ("json") or whether it should be returned as plain text ("text")
 * @returns The response data if successful, or null if an error occurs.
 */
export async function fetchWithLogging<T>(
    url: string,
    description: string,
    options?: {
        params?: Record<string, unknown> | LearningObjectIdentifier;
        query?: Record<string, unknown>;
        responseType?: 'json' | 'text';
    }
): Promise<T | null> {
    try {
        const config: AxiosRequestConfig = options || {};
        const response = await axios.get<T>(url, config);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 404) {
                    logger.debug(`❌ ERROR: ${description} not found (404) at "${url}".`);
                } else {
                    logger.debug(
                        `❌ ERROR: Failed to fetch ${description}. Status: ${error.response.status} - ${error.response.statusText} (URL: "${url}")`
                    );
                }
            } else {
                logger.debug(`❌ ERROR: Network or unexpected error when fetching ${description}:`, error.message);
            }
        }
        logger.error(`❌ ERROR: Unknown error while fetching ${description}.`, error);
        return null;
    }
}
