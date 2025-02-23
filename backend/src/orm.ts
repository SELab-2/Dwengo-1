import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { getLogger } from './logging/initalize.js';
import { Logger } from 'winston';

export default async function initORM() {
    const logger: Logger = getLogger();

    logger.info('Initializing ORM');
    logger.debug('MikroORM config is', config);

    await MikroORM.init(config);
}
