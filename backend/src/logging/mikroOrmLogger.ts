import { DefaultLogger, LogContext, LoggerNamespace } from '@mikro-orm/core';
import { Logger } from 'winston';
import { getLogger } from './initalize';
import { LokiLabels } from 'loki-logger-ts';

export class MikroOrmLogger extends DefaultLogger {
    private logger: Logger = getLogger();

    log(namespace: LoggerNamespace, message: string, context?: LogContext) {
        if (!this.isEnabled(namespace, context)) {
            return;
        }

        switch (namespace) {
            case 'query':
                this.logger.debug(
                    this.createMessage(namespace, message, context)
                );
                break;
            case 'query-params':
                // TODO Which log level should this be?
                this.logger.info(
                    this.createMessage(namespace, message, context)
                );
                break;
            case 'schema':
                this.logger.info(
                    this.createMessage(namespace, message, context)
                );
                break;
            case 'discovery':
                this.logger.debug(
                    this.createMessage(namespace, message, context)
                );
                break;
            case 'info':
                this.logger.info(
                    this.createMessage(namespace, message, context)
                );
                break;
            case 'deprecated':
                this.logger.warn(
                    this.createMessage(namespace, message, context)
                );
                break;
            default:
                switch (context?.level) {
                    case 'info':
                        this.logger.info(
                            this.createMessage(namespace, message, context)
                        );
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

    private createMessage(
        namespace: LoggerNamespace,
        messageArg: string,
        context?: LogContext
    ) {
        const labels: LokiLabels = {
            service: 'ORM',
        };

        let message: string;
        if (context?.label) {
            message = `[${namespace}] (${context?.label}) ${messageArg}`;
        } else {
            message = `[${namespace}] ${messageArg}`;
        }

        return {
            message: message,
            labels: labels,
            context: context,
        };
    }
}
