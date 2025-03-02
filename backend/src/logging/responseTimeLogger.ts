import { getLogger, Logger } from './initalize.js';
import { Request, Response } from 'express';

export function responseTimeLogger(req: Request, res: Response, time: number) {
    const logger: Logger = getLogger();

    const method = req.method;
    const url = req.url;
    const status = res.statusCode;

    logger.info({
        message: 'Request completed',
        method: method,
        url: url,
        status: status,
        responseTime: Number(time),
        labels: {
            type: 'responseTime',
        },
    });
}
