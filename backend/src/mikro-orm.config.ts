import {Options} from '@mikro-orm/core';
import {PostgreSqlDriver} from "@mikro-orm/postgresql";
import {EnvVars, getEnvVar, getNumericEnvVar} from "./util/envvars";

const config: Options = {
    driver: PostgreSqlDriver,
    host: getEnvVar(EnvVars.DbHost, {required: true}),
    port: getNumericEnvVar(EnvVars.DbPort, {defaultValue: 5432}),
    dbName: getEnvVar(EnvVars.DbName, {defaultValue: "dwengo"}),
    user: getEnvVar(EnvVars.DbUsername, {required: true}),
    password: getEnvVar(EnvVars.DbPassword, {required: true}),
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: true,
};

export default config;
