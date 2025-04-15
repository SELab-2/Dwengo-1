import fs from 'fs';
import path from 'node:path';

/**
 * Load the asset at the given path.
 * @param relPath Path of the asset relative to the test-assets folder.
 */
export function loadTestAsset(relPath: string): Buffer {
    return fs.readFileSync(path.resolve(__dirname, `../test_assets/${relPath}`));
}
