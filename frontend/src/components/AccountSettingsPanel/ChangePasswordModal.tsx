import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "../../authClient";
import { useSession } from "../../SessionContext";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import { fieldHasErrors } from "../../utils";
import FormTextField from "../FormTextField";
import PasswordErrorList from "../PasswordErrorList";

const ChangePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Please enter your current password"),
        newPassword: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .refine((val) => /[A-Z]/.test(val), {
                message: "Password must contain an uppercase character",
            })
            .refine((val) => /[0-9]/.test(val), {
                message: "Password must contain a number",
            })
            .refine((val) => /[^A-Za-z0-9]/.test(val), {
                message: "Password must contain a special character",
            }),
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
    });

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function ChangePasswordModal({
    isOpen,
    onClose,
}: ChangePasswordModalProps) {
    const { setSessionData } = useSession();
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validators: {
            onChange: ChangePasswordSchema,
        },
        onSubmit: async ({ value }) => {
            const { currentPassword, newPassword } = value;
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
        },
    });

    if (isOpen === true && prevIsOpen === false) {
        setPrevIsOpen(true);
        form.reset();
    } else if (isOpen === false && prevIsOpen === true) {
        setPrevIsOpen(false);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <form id="change-password-form" onSubmit={handleSubmit}>
                    <form.Field
                        name="currentPassword"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Current Password"
                                type="password"
                                shouldAutoFocus
                            />
                        )}
                    />
                    <form.Field
                        name="newPassword"
                        children={(field) => (
                            <>
                                <FormTextField
                                    field={field}
                                    label="New Password"
                                    type="password"
                                    helperText={
                                        fieldHasErrors(field)
                                            ? "Please create a password that meets all requirements below"
                                            : ""
                                    }
                                />
                                <PasswordErrorList
                                    password={field.state.value}
                                />
                            </>
                        )}
                    />
                    <form.Field
                        name="confirmNewPassword"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Confirm New Password"
                                type="password"
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
                            form="change-password-form"
                            disabled={isSubmitting}
                        >
                            Change Password
                        </Button>
                    )}
                />
            </DialogActions>
        </Dialog>
    );
}
