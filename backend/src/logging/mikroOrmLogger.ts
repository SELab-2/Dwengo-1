import { DefaultLogger, LogContext, LoggerNamespace } from '@mikro-orm/core';
import { getLogger, Logger } from './initalize.js';
import { LokiLabels } from 'loki-logger-ts';

export class MikroOrmLogger extends DefaultLogger {
    private logger: Logger = getLogger();

    static createMessage(namespace: LoggerNamespace, messageArg: string, context?: LogContext): unknown {
        const labels: LokiLabels = {
            service: 'ORM',
        };

        let message: string;
        if (context !== undefined && context.labels !== undefined) {
            message = `[${namespace}] (${context.label}) ${messageArg}`;
        } else {
            message = `[${namespace}] ${messageArg}`;
        }

        return {
            message: message,
            labels: labels,
            context: context,
        };
    }

    log(namespace: LoggerNamespace, message: string, context?: LogContext): void {
        if (!this.isEnabled(namespace, context)) {
            return;
        }

        switch (namespace) {
            case 'query':
                this.logger.debug(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            case 'query-params':
                // TODO Which log level should this be?
                this.logger.info(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            case 'schema':
                this.logger.info(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            case 'discovery':
                this.logger.debug(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            case 'info':
                this.logger.info(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            case 'deprecated':
                this.logger.warn(MikroOrmLogger.createMessage(namespace, message, context));
                break;
            default:
                switch (context?.level) {
                    case 'info':
                        this.logger.info(MikroOrmLogger.createMessage(namespace, message, context));
                        break;
                    case 'warning':
                        this.logger.warn(message);
                        break;
                    case 'error':
                        this.logger.error(message);
                        break;
                    default:
                        this.logger.debug(message);
                        break;
                }
        }
    }
}
