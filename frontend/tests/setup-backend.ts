import { spawn } from "child_process";
import { ChildProcess, execSync } from 'node:child_process';

let wasRunningBefore: boolean;
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
    // Check if the database container is already running
    const containerCheck = execSync("docker ps --filter 'name=db' --format '{{.Names}}'");
    wasRunningBefore = !(containerCheck.toString().includes("db"));

    // Spin up the database
    execSync("docker compose up db --detach");

    // Spin up the backend
    backendProcess = spawn("npm", ["run", "dev"], {
        cwd: "../backend",
        stdio: "inherit",
    });

    // Wait until you can curl the backend
    await waitForEndpoint("http://localhost:3000/api");
}

export async function teardown(): Promise<void> {
    if (backendProcess) {
        backendProcess.kill();
    }

    if (wasRunningBefore) {
        spawn("docker", ["compose", "down"], {
            cwd: "..",
            stdio: "inherit",
        });
    }
}
