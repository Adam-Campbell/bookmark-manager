import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { authClient } from "../../authClient";
import { queryClient } from "../../http";
import { useSession } from "../../SessionContext";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import FormTextField from "../FormTextField";

type DeleteAccountModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function DeleteAccountModal({
    isOpen,
    onClose,
}: DeleteAccountModalProps) {
    const [prevIsOpen, setPrevIsOpen] = useState(false);
    const navigate = useNavigate();
    const { setSessionData } = useSession();

    const form = useForm({
        defaultValues: {
            password: "",
        },
        validators: {
            onChange: z.object({
                password: z.string().min(1, "Please enter your password"),
            }),
        },
        onSubmit: async ({ value, formApi }) => {
            const { password } = value;
            const response: any = await authClient.deleteUser({
                password,
            });
            if (response?.error !== null) {
                if (response?.error?.code === "INVALID_PASSWORD") {
                    formApi.setFieldMeta("password", (meta) => ({
                        ...meta,
                        errorMap: {
                            onChange: [
                                {
                                    message:
                                        "The password provided was incorrect",
                                },
                            ],
                        },
                    }));
                } else {
                    showErrorSnackbar("Failed to delete account");
                }
                return;
            }
            setSessionData({ token: null, user: null });
            queryClient.clear();
            navigate("/sign-up");
            showSuccessSnackbar("Account deleted");
        },
    });

    if (isOpen === true && prevIsOpen === false) {
        setPrevIsOpen(true);
        form.reset();
    } else if (isOpen === false && prevIsOpen === true) {
        setPrevIsOpen(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            closeAfterTransition={false}
            slotProps={{
                paper: {
                    elevation: 6,
                },
            }}
        >
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
                    <form.Field
                        name="password"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Password"
                                type="password"
                                shouldAutoFocus
                            />
                        )}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <form.Subscribe
                    selector={(state) => state.isSubmitting}
                    children={(isSubmitting) => (
                        <Button
                            color="primary"
                            type="submit"
                            form="account-deletion-confirmation-form"
                            disabled={isSubmitting}
                        >
                            Delete Account
                        </Button>
                    )}
                />
            </DialogActions>
        </Dialog>
    );
}
