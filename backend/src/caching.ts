import { getLogger } from './logging/initalize.js';
import { envVars, getEnvVar } from './util/envVars.js';
import { Client } from 'memjs';

export type CacheClient = Client;

let cacheClient: CacheClient;

async function initializeClient(): Promise<CacheClient> {
    if (cacheClient !== undefined) {
        return cacheClient;
    }

    const cachingHost = getEnvVar(envVars.CacheHost);
    const cachingPort = getEnvVar(envVars.CachePort);
    const cachingUrl = `${cachingHost}:${cachingPort}`;

    if (cachingHost === '') {
        return cacheClient;
    }

    cacheClient = Client.create(cachingUrl);

    getLogger().info(`Memcached client initialized at ${cachingUrl}`);

    return cacheClient;
}

export async function getCacheClient(): Promise<CacheClient> {
    cacheClient ||= await initializeClient();
    return cacheClient;
}

export async function checkCachingHealth(): Promise<boolean> {
    try {
        const client = await getCacheClient();
        await client.set('health', Buffer.from('ok'), { expires: 60 });
        const reply = await cacheClient.get('health');
        return reply?.value?.toString() === 'ok';
    } catch (error) {
        getLogger().error('Caching Health Check Failed:', error);
        return false;
    }
}
