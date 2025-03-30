import {NextFunction, Request, Response} from "express";
import {getLogger, Logger} from "../../logging/initalize";
import {ExceptionWithHttpState} from "../../exceptions/exception-with-http-state";

const logger: Logger = getLogger();

export function errorHandler(err: unknown, req: Request, res: Response, _: NextFunction): void {
    if (err instanceof ExceptionWithHttpState) {
        logger.warn(`An error occurred while handling request ${JSON.stringify(req)}: ${err.error} (-> HTTP ${err.status})`);
        res.status(err.status).json(err);
    } else {
        logger.error(`Unexpected error occurred while handling request ${JSON.stringify(req)}: ${JSON.stringify(err)}`);
        res.status(500).json(err);
    }
}
