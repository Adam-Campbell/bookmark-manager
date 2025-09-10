import { Snackbar, Alert } from "@mui/material";
import { useSyncExternalStore } from "react";
import { hideSnackbar, subscribe, getSnapshot } from "../snackbarStore";

export default function GlobalSnackbar() {
    const { isOpen, message, severity } = useSyncExternalStore(
        subscribe,
        getSnapshot
    );

    return (
        <Snackbar open={isOpen} onClose={hideSnackbar} autoHideDuration={3000}>
            <Alert
                onClose={hideSnackbar}
                variant="filled"
                severity={severity ?? "success"}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
