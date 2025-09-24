import { type AnyFieldApi } from "@tanstack/react-form";

/**
 * Checks if a Tanstack Form field has errors based on its state.
 * @param field The form field to check for errors.
 * @returns True if the field has errors, otherwise false.
 */
export function fieldHasErrors(field: AnyFieldApi): boolean {
    return field.state.meta.isTouched && !field.state.meta.isValid;
}

/**
 * Gets the error message for a Tanstack Form field if it has errors.
 * @param field The form field to check for errors.
 * @returns The error message if the field has errors, otherwise null.
 */
export function getFieldErrors(field: AnyFieldApi): string | null {
    return fieldHasErrors(field) ? field.state.meta.errors[0].message : null;
}

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
