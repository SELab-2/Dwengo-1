import { spawn } from 'child_process';
import { ChildProcess } from 'node:child_process';

let backendProcess: ChildProcess;

export async function setup(): Promise<void> {
    // Spin up the database
    spawn('docker', ['compose', 'up', 'db', '--detach'], {
        cwd: '..',
        stdio: "pipe",
    });

    backendProcess = spawn('npm', ['run', 'dev'], {
        cwd: '../backend',
        stdio: "pipe",
    });

    // Wait until you can curl the backend
    let backendReady = false;
    while (!backendReady) {
        try {
            await fetch('http://localhost:3000/api')
            backendReady = true;
        } catch (_) {
            // Ignore the error
        }
    }
}

export async function teardown(): Promise<void> {
    if (backendProcess) {
        backendProcess.kill();
    }

    spawn('docker', ['compose', 'down'], {
        cwd: '..',
        stdio: "pipe"
    });
}
