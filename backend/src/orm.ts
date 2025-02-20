import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import {EnvVars, getEnvVar} from "./util/envvars";

export default async function initORM() {
    const orm = await MikroORM.init(config);

    // Update the database scheme if necessary and enabled.
    if (getEnvVar(EnvVars.DbUpdate)) {
        await orm.schema.updateSchema();
    } else {
        const diff = await orm.schema.getUpdateSchemaSQL();
        if (diff) {
            throw Error("The database structure needs to be updated in order to fit the new database structure " +
                "of the app. In order to do so automatically, set the environment variable DWENGO_DB_UPDATE to true. " +
                "The following queries will then be executed:\n" + diff)
        }
    }
}
