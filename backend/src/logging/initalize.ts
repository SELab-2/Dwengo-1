import { createLogger, format, Logger, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { LokiLabels } from 'loki-logger-ts';

const LoggingLevel = 'development' === process.env.NODE_ENV ? 'debug' : 'info';
const Host = 'http://localhost:3102';
const Labels: LokiLabels = {
    source: 'Dwengo-Backend',
    job: 'Dwengo-Backend',
    host: 'localhost',
};

let logger: Logger;

function initializeLogger() {
    if (logger !== undefined) {
        return logger;
    }

    const lokiTransport: LokiTransport = new LokiTransport({
        host: Host,
        labels: Labels,
        level: LoggingLevel,
        json: true,
        format: format.combine(format.timestamp(), format.json()),
        onConnectionError: (err) => {
            console.error(`Connection error: ${err}`);
        },
    });

    const consoleTransport = new transports.Console({
        level: LoggingLevel,
        format: format.combine(format.simple(), format.colorize()),
    });

    logger = createLogger({
        transports: [lokiTransport, consoleTransport],
    });

    logger.debug('Logger initialized');
    return logger;
}

export function getLogger(): Logger {
    logger ||= initializeLogger();
    return logger;
}
