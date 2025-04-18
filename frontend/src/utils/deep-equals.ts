export function deepEquals<T>(a: T, b: T): boolean {
    if (a === b) {return true;}

    if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null)
        {return false;}

    if (Array.isArray(a) !== Array.isArray(b)) {return false;}

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {return false;}
        return a.every((val, i) => deepEquals(val, b[i]));
    }

    const keysA = Object.keys(a) as (keyof T)[];
    const keysB = Object.keys(b) as (keyof T)[];

    if (keysA.length !== keysB.length) {return false;}

    return keysA.every(key => deepEquals(a[key], b[key]));
}
