export interface HasStatusCode {
    status: number;
}
export function hasStatusCode(err: unknown): err is HasStatusCode {
    return typeof err === 'object' && err !== null && 'status' in err && typeof (err as HasStatusCode)?.status === 'number';
}
