import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvVars, getEnvVar, getNumericEnvVar } from './util/envvars';
import { SqliteDriver } from '@mikro-orm/sqlite';

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
            dynamicImportProvider: (id) => import(id),
        };
    } else {
        return {
            driver: PostgreSqlDriver,
            host: getEnvVar(EnvVars.DbHost),
            port: getNumericEnvVar(EnvVars.DbPort),
            dbName: getEnvVar(EnvVars.DbName),
            user: getEnvVar(EnvVars.DbUsername),
            password: getEnvVar(EnvVars.DbPassword),
            entities: entities,
            entitiesTs: entitiesTs,
            debug: true,
        };
    }
}

export default config;
