import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { LokiLabels } from 'loki-logger-ts';
import { envVars, getEnvVar } from '../util/envVars.js';

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

    const logLevel = getEnvVar(envVars.LogLevel);

    const consoleTransport = new transports.Console({
        level: getEnvVar(envVars.LogLevel),
        format: format.combine(format.cli(), format.simple()),
    });

    if (getEnvVar(envVars.RunMode) === 'dev') {
        logger = createLogger({
            transports: [consoleTransport],
        });
        logger.debug(`Logger initialized with level ${logLevel} to console`);
        return logger;
    }

    const lokiHost = getEnvVar(envVars.LokiHost);

    const lokiTransport: LokiTransport = new LokiTransport({
        host: lokiHost,
        labels: lokiLabels,
        level: logLevel,
        json: true,
        format: format.combine(format.timestamp(), format.json()),
        onConnectionError: (err): void => {
            // eslint-disable-next-line no-console
            console.error(`Connection error: ${err}`);
        },
    });

    logger = createLogger({
        transports: [lokiTransport, consoleTransport],
    });

    logger.debug(`Logger initialized with level ${logLevel} to Loki host ${lokiHost}`);
    return logger;
}

export function getLogger(): Logger {
    logger ||= initializeLogger();
    return logger;
}
