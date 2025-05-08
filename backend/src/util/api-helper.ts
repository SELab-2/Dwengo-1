import axios, { AxiosRequestConfig } from 'axios';
import { getLogger, Logger } from '../logging/initalize.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { getCacheClient } from '../caching.js';
import { envVars, getEnvVar, getNumericEnvVar } from './envVars.js';

const logger: Logger = getLogger();
const runMode: string = getEnvVar(envVars.RunMode);
const prefix: string = getEnvVar(envVars.CacheKeyPrefix);

interface Options {
    params?: Record<string, unknown> | LearningObjectIdentifier;
    query?: Record<string, unknown>;
    responseType?: 'json' | 'text';
}

/**
 * Utility function to fetch data from an API endpoint with error handling and caching.
 * Logs errors but does NOT throw exceptions to keep the system running.
 *
 * @param url The API endpoint to fetch from.
 * @param description A short description of what is being fetched (for logging).
 * @param options Contains further options such as params (the query params) and responseType (whether the response
 *                should be parsed as JSON ("json") or whether it should be returned as plain text ("text")
 * @param cacheTTL Time-to-live for the cache in seconds (default: 60 seconds).
 * @returns The response data if successful, or null if an error occurs.
 */
export async function fetchRemote<T>(
    url: string,
    description: string,
    options?: Options,
    cacheTTL?: number
): Promise<T | null> {
    if (runMode !== 'dev') {
        return fetchWithCache<T>(url, description, options, cacheTTL);
    }

    getLogger().info(`🔄 INFO: Bypassing cache for ${description} at "${url}".`);
    return fetchWithLogging(url, description, options);
}

async function fetchWithCache<T>(
    url: string,
    description: string,
    options?: Options,
    cacheTTL?: number
): Promise<T | null> {
    // Create a unique cache key based on the URL and options
    const cacheKey = `${prefix}:${url}${options?.params ? JSON.stringify(options.params) : ''}`;
    const cacheClient = await getCacheClient();

    const cachedData = await cacheClient.get(cacheKey);
    if (cachedData !== null && cachedData !== undefined) { // TODO What should this condition actually be?
        // Cache hit! :)
        getLogger().debug(`✅ INFO: Cache hit for ${description} at "${url}".`);
        return JSON.parse(cachedData) as T;
    }

    // Cache miss :(
    logger.debug(`🔄 INFO: Cache miss for ${description} at "${url}". Fetching data...`);
    const response = await fetchWithLogging<T>(url, description, options);
    logger.debug(`🔄 INFO: Fetched data for ${description} at "${url}".`);
    await cacheClient.setEx(cacheKey, cacheTTL || getNumericEnvVar(envVars.CacheTTL), JSON.stringify(response));
    logger.debug(`✅ INFO: Cached response for ${description} at "${url}" for ${cacheTTL} seconds.`);

    return response;
}

async function fetchWithLogging<T>(
    url: string,
    description: string,
    options?: Options,
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
                        `❌ ERROR: Failed to fetch ${description}. Status: ${error.response.status} - ${error.response.statusText} (URL: "${url}")`,
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
