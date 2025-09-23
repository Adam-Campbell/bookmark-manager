import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Stack,
    Alert,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router";
import { useSession } from "../SessionContext";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";
import type React from "react";

const SignInSchema = z.object({
    email: z.email("Please enter your email address"),
    password: z.string().min(1, "Please enter your password"),
});

const signInDefaultValues = {
    email: "",
    password: "",
};

function fieldHasErrors(field: AnyFieldApi): boolean {
    return field.state.meta.isTouched && !field.state.meta.isValid;
}

function getFieldErrors(field: AnyFieldApi): string | null {
    return fieldHasErrors(field) ? field.state.meta.errors[0].message : null;
}

export default function SignInPage() {
    const { signIn, isLoggedIn } = useSession();
    const [submissionResponseError, setSubmissionResponseError] =
        useState<String | null>(null);

    const form = useForm({
        defaultValues: signInDefaultValues,
        validators: {
            onChange: SignInSchema,
        },
        onSubmit: async ({ value }) => {
            const { email, password } = value;
            try {
                await signIn(email, password);
            } catch (error) {
                let message = "An unexpected error occurred";
                if (error instanceof Error) {
                    message = error.message;
                }
                setSubmissionResponseError(message);
            }
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    if (isLoggedIn) {
        return <Navigate to="/bookmarks" />;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack component="form" method="post" onSubmit={handleSubmit}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Sign In
                    </Typography>
                    {submissionResponseError && (
                        <Alert
                            severity="error"
                            onClose={() => setSubmissionResponseError(null)}
                        >
                            {submissionResponseError}
                        </Alert>
                    )}
                    <form.Field
                        name="email"
                        children={(field) => (
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="filled"
                                name="email"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                error={fieldHasErrors(field)}
                                helperText={getFieldErrors(field)}
                            />
                        )}
                    />
                    <form.Field
                        name="password"
                        children={(field) => (
                            <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                variant="filled"
                                name="password"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                error={fieldHasErrors(field)}
                                helperText={getFieldErrors(field)}
                            />
                        )}
                    />

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/sign-up"
                            underline="hover"
                        >
                            Sign Up
                        </Link>
                    </Typography>
                    <Button
                        sx={{ marginLeft: "auto" }}
                        variant="contained"
                        type="submit"
                    >
                        Sign In
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
