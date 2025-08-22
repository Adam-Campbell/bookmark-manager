/**
 * Delays the resolution of a promise by a specified amount of time.
 * Used for testing loading states etc.
 * @param ms The amount of time to delay, in milliseconds.
 * @param value The value to resolve the promise with.
 * @returns A promise that resolves with the specified value after the delay.
 */
export function delay<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
