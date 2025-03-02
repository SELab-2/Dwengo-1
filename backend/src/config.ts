// Logging

export const LOG_LEVEL: string =
    'development' === process.env.NODE_ENV ? 'debug' : 'info';
export const LOKI_HOST: string =
    process.env.LOKI_HOST || 'http://localhost:3102';
