import { EntityManager, MikroORM} from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import {EnvVars, getEnvVar} from "./util/envvars";

let orm: MikroORM | undefined;
export async function initORM(testingMode: boolean = false) {
    orm = await MikroORM.init(config(testingMode));
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
export function forkEntityManager(): EntityManager {
    if (!orm) {
        throw Error("Accessing the Entity Manager before the ORM is fully initialized.")
    }
    return orm.em.fork();
}
