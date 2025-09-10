import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { authClient } from "../../authClient";
import { useSession } from "../../SessionContext";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function ChangePasswordModal({
    isOpen,
    onClose,
}: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const { setSessionData } = useSession();
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen === true && prevIsOpen === false) {
        setPrevIsOpen(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    } else if (isOpen === false && prevIsOpen === true) {
        setPrevIsOpen(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { data, error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        });
        if (error) {
            showErrorSnackbar("Failed to update password");
            return;
        }
        setSessionData(data);
        onClose();
        showSuccessSnackbar("Password updated");
    }

    const isDisabled =
        currentPassword === "" ||
        newPassword === "" ||
        newPassword === currentPassword ||
        newPassword !== confirmNewPassword;

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <form id="change-password-form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="filled"
                        margin="dense"
                        label="Current Password"
                        type="password"
                        id="current-password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        margin="dense"
                        label="New Password"
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        margin="dense"
                        label="Confirm New Password"
                        type="password"
                        id="confirm-new-password"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                    form="change-password-form"
                    disabled={isDisabled}
                >
                    Change Password
                </Button>
            </DialogActions>
        </Dialog>
    );
}
