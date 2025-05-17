import { initORM } from '../src/orm.js';
import dotenv from 'dotenv';
import { getLogger, Logger } from '../src/logging/initalize.js';
import { seedORM } from './seedORM.js';

const logger: Logger = getLogger();

export async function seedDatabase(
    envFile = '.env.development.local',
    testMode = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'test'
): Promise<void> {
    dotenv.config({ path: envFile });

    try {
        const orm = await initORM(testMode);
        await seedORM(orm);
        await orm.close();
    } catch (err) {
        logger.error(`Error: ${err}`);
    }
}

seedDatabase().catch((err) => logger.error(`Seeding: ${err}`));
