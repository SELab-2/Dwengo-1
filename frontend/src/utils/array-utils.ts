export function copyArrayWith<T>(index: number, newValue: T, array: T[]): T[] {
    const copy = [...array];
    copy[index] = newValue;
    return copy;
}
