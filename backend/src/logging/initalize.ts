import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { LokiLabels } from 'loki-logger-ts';
import { LOG_LEVEL, LOKI_HOST } from '../config.js';

export class Logger extends WinstonLogger {
    constructor() {
        super();
    }
}

const lokiLabels: LokiLabels = {
    source: 'Dwengo-Backend',
    service: 'API',
    host: 'localhost',
};

let logger: Logger;

function initializeLogger(): Logger {
    if (logger !== undefined) {
        return logger;
    }

    const lokiTransport: LokiTransport = new LokiTransport({
        host: LOKI_HOST,
        labels: lokiLabels,
        level: LOG_LEVEL,
        json: true,
        format: format.combine(format.timestamp(), format.json()),
        onConnectionError: (err): void => {
            // eslint-disable-next-line no-console
            console.error(`Connection error: ${err}`);
        },
    });

    const consoleTransport = new transports.Console({
        level: LOG_LEVEL,
        format: format.combine(format.cli(), format.colorize()),
    });

    logger = createLogger({
        transports: [lokiTransport, consoleTransport],
    });

    logger.debug(`Logger initialized with level ${LOG_LEVEL}, Loki host ${LOKI_HOST}`);
    return logger;
}

export function getLogger(): Logger {
    logger ||= initializeLogger();
    return logger;
}
