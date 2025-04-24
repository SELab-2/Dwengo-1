import { describe, it, expect } from 'vitest';
import { deepEquals } from '../../src/utils/deep-equals';

describe('deepEquals', () => {
  it('should return true for identical primitive values', () => {
    expect(deepEquals(1, 1)).toBe(true);
    expect(deepEquals('test', 'test')).toBe(true);
    expect(deepEquals(true, true)).toBe(true);
  });

  it('should return false for different primitive values', () => {
    expect(deepEquals(1, 2)).toBe(false);
    expect(deepEquals('test', 'other')).toBe(false);
    expect(deepEquals(true, false)).toBe(false);
  });

  it('should return true for identical objects', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(deepEquals(obj1, obj2)).toBe(true);
  });

  it('should return false for different objects', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };
    expect(deepEquals(obj1, obj2)).toBe(false);
  });

  it('should return true for identical arrays', () => {
    const arr1 = [1, 2, [3, 4]];
    const arr2 = [1, 2, [3, 4]];
    expect(deepEquals(arr1, arr2)).toBe(true);
  });

  it('should return false for different arrays', () => {
    const arr1 = [1, 2, [3, 4]];
    const arr2 = [1, 2, [3, 5]];
    expect(deepEquals(arr1, arr2)).toBe(false);
  });

  it('should return false for objects and arrays compared', () => {
    expect(deepEquals({ a: 1 }, [1])).toBe(false);
  });

  it('should return true for null compared to null', () => {
    expect(deepEquals(null, null)).toBe(true);
  });

  it('should return false for null compared to an object', () => {
    expect(deepEquals(null, {})).toBe(false);
  });

  it('should return false for undefined compared to null', () => {
    expect(deepEquals(undefined, null)).toBe(false);
  });

  it('should return true for deeply nested identical structures', () => {
    const obj1 = { a: [1, { b: 2, c: [3, 4] }] };
    const obj2 = { a: [1, { b: 2, c: [3, 4] }] };
    expect(deepEquals(obj1, obj2)).toBe(true);
  });

  it('should return false for deeply nested different structures', () => {
    const obj1 = { a: [1, { b: 2, c: [3, 4] }] };
    const obj2 = { a: [1, { b: 2, c: [3, 5] }] };
    expect(deepEquals(obj1, obj2)).toBe(false);
  });
});
