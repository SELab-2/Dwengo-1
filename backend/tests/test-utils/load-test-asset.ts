import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

/**
 * Load the asset at the given path.
 * @param relPath Path of the asset relative to the test-assets folder.
 */
export function loadTestAsset(relPath: string): Buffer {
    return fs.readFileSync(path.resolve(dirName, `../test_assets/${relPath}`));
}
