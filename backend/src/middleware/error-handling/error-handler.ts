import { NextFunction, Request, Response } from 'express';
import { getLogger, Logger } from '../../logging/initalize.js';
import { ExceptionWithHttpState } from '../../exceptions/exception-with-http-state.js';

const logger: Logger = getLogger();

export function errorHandler(err: unknown, _req: Request, res: Response, _: NextFunction): void {
    if (err instanceof ExceptionWithHttpState) {
        logger.warn(`An error occurred while handling a request: ${err} (-> HTTP ${err.status})`);
        res.status(err.status).json(err);
    } else {
        logger.error(`Unexpected error occurred while handing a request: ${(err as {stack: string})?.stack ?? JSON.stringify(err)}`);
        res.status(500).json(err);
    }
}
