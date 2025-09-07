/**
 * Takes the value and returns a promise that resolves with that value after the specified delay.
 * Can be awaited for testing purposes.
 * @param ms The amount of time to delay, in milliseconds.
 * @param value The value to resolve the promise with.
 * @returns A promise that resolves with the specified value after the delay.
 */
export function delay<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Formats a count value into a human-readable string.
 * @param count number of items
 * @param singular singular form of the item
 * @param plural plural form of the item
 * @returns formatted string
 */
export function countFormatter(
    count: number,
    singular: string,
    plural?: string
): string {
    if (!plural) {
        plural = singular + "s";
    }
    if (count === 0) {
        return `No ${plural}`;
    }
    return `${count} ${count === 1 ? singular : plural}`;
}
