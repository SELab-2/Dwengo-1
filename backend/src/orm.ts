import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

export default async function initORM() {
    await MikroORM.init(config);
}
