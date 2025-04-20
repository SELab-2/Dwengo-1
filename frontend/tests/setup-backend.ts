import { spawn } from "child_process";
import { ChildProcess, spawnSync } from 'node:child_process';

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
    spawnSync("npm", ["run", "predev"], {
        cwd: "../backend",
        stdio: "inherit",
    });

    // Spin up the backend
    backendProcess = spawn("tsx", ["--env-file=.env.development.example", "tool/startTestApp.ts"], {
        cwd: "../backend",
        stdio: "inherit",
        env: {
            ...process.env,
            NODE_ENV: 'test',
        }
    });

    // Wait until you can curl the backend
    await waitForEndpoint("http://localhost:9876/api");
}

export async function teardown(): Promise<void> {
    if (backendProcess) {
        backendProcess.kill();
    }
}
