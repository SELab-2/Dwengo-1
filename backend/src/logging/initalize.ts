import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { LokiLabels } from 'loki-logger-ts';
import { EnvVars, getEnvVar } from '../util/envvars';

export class Logger extends WinstonLogger {
    constructor() {
        super();
    }
}

const Labels: LokiLabels = {
    source: 'Dwengo-Backend',
    service: 'API',
    host: 'localhost',
};

let logger: Logger;

function initializeLogger(): Logger {
    if (logger !== undefined) {
        return logger;
    }

    const logLevel = getEnvVar(EnvVars.LogLevel);

    const consoleTransport = new transports.Console({
        level: getEnvVar(EnvVars.LogLevel),
        format: format.combine(format.cli(), format.colorize()),
    });

    if (getEnvVar(EnvVars.RunMode) === 'dev') {
        return createLogger({
            transports: [consoleTransport],
        });
    }

    const lokiHost = getEnvVar(EnvVars.LokiHost);

    const lokiTransport: LokiTransport = new LokiTransport({
        host: lokiHost,
        labels: Labels,
        level: logLevel,
        json: true,
        format: format.combine(format.timestamp(), format.json()),
        onConnectionError: (err) => {
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
