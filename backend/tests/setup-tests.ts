import {initORM} from "../src/orm";
import dotenv from "dotenv";

export async function setupTestApp() {
    dotenv.config({path: ".env.test"});
    await initORM(true);
}
