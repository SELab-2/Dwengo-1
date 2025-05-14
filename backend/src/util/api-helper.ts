import axios, { AxiosRequestConfig } from 'axios';
import { getLogger, Logger } from '../logging/initalize.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { getCacheClient } from '../caching.js';
import { envVars, getEnvVar, getNumericEnvVar } from './envVars.js';
import { createHash } from 'crypto';

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
    cacheTTL?: number,
): Promise<T | null> {
    if (runMode !== 'dev' && !runMode.includes('test')) {
        return fetchWithCache<T>(url, description, options, cacheTTL);
    }

    getLogger().debug(`🔄 INFO: Bypassing cache for ${description} at "${url}".`);
    return fetchWithLogging(url, description, options);
}

async function fetchWithCache<T>(
    url: string,
    description: string,
    options?: Options,
    cacheTTL?: number,
): Promise<T | null> {
    // Combine the URL and parameters to create a unique cache key.
    // NOTE Using a hash function to keep the key short, since Memcached has a limit on key size
    const urlWithParams = `${url}${options?.params ? JSON.stringify(options.params) : ''}`;
    const hashedUrl = createHash('sha256').update(urlWithParams).digest('hex');
    const key = `${prefix}:${hashedUrl}`;
    const client = await getCacheClient();

    const cachedData = await client.get(key);

    if (cachedData?.value) {
        logger.debug(`✅ INFO: Cache hit for ${description} at "${url}" (key: "${key}")`);
        return JSON.parse(cachedData.value.toString()) as T;
    }

    logger.debug(`🔄 INFO: Cache miss for ${description} at "${url}". Fetching data...`);
    const response = await fetchWithLogging<T>(url, description, options);

    const ttl = cacheTTL || getNumericEnvVar(envVars.CacheTTL);
    await client.set(key, JSON.stringify(response), { expires: ttl });
    logger.debug(`✅ INFO: Cached response for ${description} at "${url}" for ${ttl} seconds. (key: "${key}")`);

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
