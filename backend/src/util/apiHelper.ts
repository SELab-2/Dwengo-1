import axios, { AxiosRequestConfig } from 'axios';
import { getLogger } from '../logging/initalize.js';
import { Logger } from 'winston';

const logger: Logger = getLogger();

/**
 * Utility function to fetch data from an API endpoint with error handling.
 * Logs errors but does NOT throw exceptions to keep the system running.
 *
 * @param url The API endpoint to fetch from.
 * @param description A short description of what is being fetched (for logging).
 * @param params
 * @returns The response data if successful, or null if an error occurs.
 */
export async function fetchWithLogging<T>(
    url: string,
    description: string,
    params?: Record<string, any>
): Promise<T | null> {
    try {
        const config: AxiosRequestConfig = params ? { params } : {};

        const response = await axios.get<T>(url, config);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                logger.error(
                    `❌ ERROR: ${description} not found (404) at "${url}".`
                );
            } else {
                logger.error(
                    `❌ ERROR: Failed to fetch ${description}. Status: ${error.response.status} - ${error.response.statusText} (URL: "${url}")`
                );
            }
        } else {
            logger.error(
                `❌ ERROR: Network or unexpected error when fetching ${description}:`,
                error.message
            );
        }
        return null;
    }
}
