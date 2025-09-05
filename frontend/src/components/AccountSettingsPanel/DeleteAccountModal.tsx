import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../authClient";
import { queryClient } from "../../http";
import { useSession } from "../../SessionContext";

type DeleteAccountModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function DeleteAccountModal({
    isOpen,
    onClose,
}: DeleteAccountModalProps) {
    const [password, setPassword] = useState("");
    const [prevIsOpen, setPrevIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { setSessionData } = useSession();

    if (isOpen === true && prevIsOpen === false) {
        setPrevIsOpen(true);
        setPassword("");
        setErrorMessage("");
    } else if (isOpen === false && prevIsOpen === true) {
        setPrevIsOpen(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Deleting account...");
        const response: any = await authClient.deleteUser({
            password,
        });
        console.log(response);
        if (response?.error !== null) {
            if (response?.error?.code === "INVALID_PASSWORD") {
                setErrorMessage("Password is incorrect.");
            }
            return;
        }
        setSessionData({ token: null, user: null });
        queryClient.clear();
        navigate("/sign-up");
    }

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
                <form
                    id="account-deletion-confirmation-form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="subtitle1">
                        Are you sure you wish to delete your account?
                    </Typography>
                    <Typography variant="body1">
                        Please note that this action cannot be undone. If you
                        wish to proceed, please enter your password below.
                    </Typography>
                    <TextField
                        fullWidth
                        variant="filled"
                        margin="dense"
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errorMessage !== ""}
                        helperText={errorMessage}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    type="submit"
                    form="account-deletion-confirmation-form"
                >
                    Delete Account
                </Button>
            </DialogActions>
        </Dialog>
    );
}
