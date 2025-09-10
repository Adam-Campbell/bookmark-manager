/**
 * This store manages the snackbar state for the application, providing methods to
 * imperatively show and hide a snackbar. We use an external store rather than context
 * so that any code, even data fetching code that lives outside of the React tree, can
 * trigger a snackbar.
 *
 * The store provides a public interface matching the interface expected by the
 * useSyncExternalStore hook, which is used within the GlobalSnackbar component to
 * sync up with the store state.
 */

type snackbarSeverity = "error" | "success";

type snackbarState = {
    isOpen: boolean;
    message: string | null;
    severity: snackbarSeverity | null;
};

const initialState: snackbarState = {
    isOpen: false,
    message: null,
    severity: null,
};

let state: snackbarState = initialState;

let listeners: (() => void)[] = [];

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

function showSnackbar(message: string, severity: snackbarSeverity) {
    state = {
        isOpen: true,
        message,
        severity,
    };
    emitChange();
}

export function showErrorSnackbar(message: string) {
    showSnackbar(message, "error");
}

export function showSuccessSnackbar(message: string) {
    showSnackbar(message, "success");
}

export function hideSnackbar() {
    state = {
        ...state,
        isOpen: false,
    };
    emitChange();
}

export function subscribe(listener: () => void) {
    listeners.push(listener);
    return function unsubscribe() {
        listeners = listeners.filter((l) => l !== listener);
    };
}

export function getSnapshot() {
    return state;
}
