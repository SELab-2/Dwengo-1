import { EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { envVars, getEnvVar } from './util/envVars.js';
import { getLogger, Logger } from './logging/initalize.js';

let orm: MikroORM | undefined;
export async function initORM(testingMode = false): Promise<MikroORM<IDatabaseDriver, EntityManager>> {
    const logger: Logger = getLogger();

    const options = config(testingMode);

    logger.info('MikroORM config is', options);

    logger.info('Initializing ORM');
    orm = await MikroORM.init(options);
    logger.info('MikroORM initialized');

    // Update the database scheme if necessary and enabled.
    if (getEnvVar(envVars.DbUpdate)) {
        logger.info("MikroORM: Updating database schema");
        await orm.schema.updateSchema();
    } else {
        const diff = await orm.schema.getUpdateSchemaSQL();
        if (diff) {
            throw Error(
                'The database structure needs to be updated in order to fit the new database structure ' +
                    'of the app. In order to do so automatically, set the environment variable DWENGO_DB_UPDATE to true. ' +
                    'The following queries will then be executed:\n' +
                    diff
            );
        }
    }

    return orm;
}
export function forkEntityManager(): EntityManager {
    if (!orm) {
        throw Error('Accessing the Entity Manager before the ORM is fully initialized.');
    }
    return orm.em.fork();
}
