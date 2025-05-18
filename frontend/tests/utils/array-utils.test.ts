import {copyArrayWith} from "../../src/utils/array-utils";
import { describe, it, expect } from "vitest";

describe('copyArrayWith', () => {
    it('should replace the element at the specified index', () => {
        const original = [1, 2, 3, 4];
        const result = copyArrayWith(2, 99, original);
        expect(result).toEqual([1, 2, 99, 4]);
    });

    it('should not modify the original array', () => {
        const original = ['a', 'b', 'c'];
        const result = copyArrayWith(1, 'x', original);
        expect(original).toEqual(['a', 'b', 'c']); // Original remains unchanged
        expect(result).toEqual(['a', 'x', 'c']);
    });

    it('should handle replacing the first element', () => {
        const original = [true, false, true];
        const result = copyArrayWith(0, false, original);
        expect(result).toEqual([false, false, true]);
    });

    it('should handle replacing the last element', () => {
        const original = ['apple', 'banana', 'cherry'];
        const result = copyArrayWith(2, 'date', original);
        expect(result).toEqual(['apple', 'banana', 'date']);
    });

    it('should work with complex objects', () => {
        const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const newValue = { id: 99 };
        const result = copyArrayWith(1, newValue, original);
        expect(result).toEqual([{ id: 1 }, { id: 99 }, { id: 3 }]);
        expect(original[1].id).toBe(2); // Original remains unchanged
    });


    it('should allow setting to undefined', () => {
        const original = [1, 2, 3];
        const result = copyArrayWith(1, undefined, original);
        expect(result).toEqual([1, undefined, 3]);
    });

    it('should allow setting to null', () => {
        const original = [1, 2, 3];
        const result = copyArrayWith(1, null, original);
        expect(result).toEqual([1, null, 3]);
    });
});
