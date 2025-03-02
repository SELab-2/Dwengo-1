import { describe, it, expect, beforeAll } from 'vitest';
import { convertBase64ToImageSrc } from '../../src/utils/base64ToImage.js';
import fs from 'fs';
import path from 'path';

let sampleBase64: string;

beforeAll(() => {
    // Load base64 sample from text file
    const filePath = path.resolve(__dirname, 'base64Sample.txt');
    sampleBase64 = fs.readFileSync(filePath, 'utf8').trim();
});

describe('convertBase64ToImageSrc', () => {
    it('should return the same string if it is already a valid data URL', () => {
        const base64Image = `data:image/png;base64,${sampleBase64}`;
        expect(convertBase64ToImageSrc(base64Image)).toBe(base64Image);
    });

    it('should correctly format a raw Base64 string as a PNG image URL', () => {
        expect(convertBase64ToImageSrc(sampleBase64)).toBe(`data:image/png;base64,${sampleBase64}`);
    });

});
