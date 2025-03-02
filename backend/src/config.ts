export const FALLBACK_LANG: string = 'nl';

// API

export const DWENGO_API_BASE: string = 'https://dwengo.org/backend/api';

// Logging

export const LOG_LEVEL: string =
  'development' === process.env.NODE_ENV ? 'debug' : 'info';
export const LOKI_HOST: string =
  process.env.LOKI_HOST || 'http://localhost:3102';
