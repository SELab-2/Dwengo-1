import { LoggerOptions, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvVars, getEnvVar, getNumericEnvVar } from './util/envvars.js';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroOrmLogger } from './logging/mikroOrmLogger.js';
import { LOG_LEVEL } from './config.js';

const entities = ['dist/**/*.entity.js'];
const entitiesTs = ['src/**/*.entity.ts'];

function config(testingMode: boolean = false): Options {
    if (testingMode) {
        return {
            driver: SqliteDriver,
            dbName: getEnvVar(EnvVars.DbName),
            entities: entities,
            entitiesTs: entitiesTs,

            // Workaround: vitest: `TypeError: Unknown file extension ".ts"` (ERR_UNKNOWN_FILE_EXTENSION)
            // (see https://mikro-orm.io/docs/guide/project-setup#testing-the-endpoint)
            dynamicImportProvider: (id) => {
                return import(id);
            },
        };
    }

    return {
        driver: PostgreSqlDriver,
        host: getEnvVar(EnvVars.DbHost),
        port: getNumericEnvVar(EnvVars.DbPort),
        dbName: getEnvVar(EnvVars.DbName),
        user: getEnvVar(EnvVars.DbUsername),
        password: getEnvVar(EnvVars.DbPassword),
        entities: entities,
        entitiesTs: entitiesTs,

        // Logging
        debug: LOG_LEVEL === 'debug',
        loggerFactory: (options: LoggerOptions) => {
            return new MikroOrmLogger(options);
        },
    };
}

export default config;
