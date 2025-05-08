import { createClient, RedisClientType } from 'redis';
import { getLogger } from './logging/initalize.js';
import { envVars, getEnvVar } from './util/envVars.js';

export type CacheClient = RedisClientType;

let redisClient: CacheClient;

async function initializeClient(): Promise<CacheClient> {
    if (redisClient !== undefined) {
        return redisClient;
    }

    const redisHost = getEnvVar(envVars.CacheHost);
    const redisPort = getEnvVar(envVars.CachePort);
    const redisUrl = `redis://${redisHost}:${redisPort}`;

    redisClient = createClient({
        url: redisUrl
    });

    redisClient.on('error', (err) => getLogger().error('Redis error:', err));
    await redisClient.connect();

    return redisClient;
}

export async function getCacheClient(): Promise<CacheClient> {
    redisClient ||= await initializeClient();
    return redisClient;
}

export async function checkRedisHealth(): Promise<boolean> {
    try {
        await redisClient.set('health', 'ok');
        const reply = await redisClient.get('health');
        return reply === 'ok';
    } catch (error) {
        getLogger().error('Redis Health Check Failed:', error);
        return false;
    }
}
