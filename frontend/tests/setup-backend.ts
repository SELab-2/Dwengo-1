import { spawn } from "child_process";
import { ChildProcess } from "node:child_process";

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
    // Spin up the database
    spawn("docker", ["compose", "up", "db", "--detach"], {
        cwd: "..",
        stdio: "inherit",
    });

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

    spawn("docker", ["compose", "down"], {
        cwd: "..",
        stdio: "inherit"
    });
}
