import { LoggerOptions, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmLogger } from './logging/mikroOrmLogger.js';
import { LOG_LEVEL } from './config.js';

const config: Options = {
    driver: PostgreSqlDriver,
    dbName: 'dwengo',
    password: 'postgres',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],

    // Logging
    debug: LOG_LEVEL === 'debug',
    loggerFactory: (options: LoggerOptions) => {
        return new MikroOrmLogger(options);
    },
};

export default config;
