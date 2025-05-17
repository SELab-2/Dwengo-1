import { spawn } from "child_process";
import { ChildProcess, spawnSync } from "node:child_process";
import { getLogger } from "../../backend/src/logging/initalize";

let backendProcess: ChildProcess;

async function waitForEndpoint(url: string, delay = 1000, retries = 60): Promise<void> {
    try {
        await fetch(url);
    } catch {
        // Endpoint is not ready yet
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Retry
        await waitForEndpoint(url, delay, retries - 1);
    }
}

export async function setup(): Promise<void> {
    // Precompile needed packages
    spawnSync("npx", ["tsc", "--build", "tsconfig.json"], {
        cwd: `../common`,
    });

    // Spin up the backend
    backendProcess = spawn("npx", ["tsx", "--env-file=.env.test", "tool/startTestApp.ts"], {
        cwd: `../backend`,
        env: {
            ...process.env,
            NODE_ENV: "test",
        },
    });

    // Wait until you can curl the backend
    await waitForEndpoint("http://localhost:9876/api");
}

export async function teardown(): Promise<void> {
    if (backendProcess) {
        while (!backendProcess.kill()) {
            getLogger().error(`Failed to kill backend process! Retrying...`);
        }
    }
}
