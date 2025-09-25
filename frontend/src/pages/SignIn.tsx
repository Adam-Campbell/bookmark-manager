import {
    Container,
    Paper,
    Button,
    Typography,
    Link,
    Stack,
    Alert,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router";
import { z } from "zod";
import FormTextField from "../components/FormTextField";
import { useSession } from "../SessionContext";

const SignInSchema = z.object({
    email: z.email("Please enter your email address"),
    password: z.string().min(1, "Please enter your password"),
});

const signInDefaultValues = {
    email: "",
    password: "",
};

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
        <Container maxWidth="sm" sx={{ py: 6 }}>
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
                            <FormTextField
                                field={field}
                                label="Email"
                                type="email"
                                shouldAutoFocus
                            />
                        )}
                    />
                    <form.Field
                        name="password"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Password"
                                type="password"
                            />
                        )}
                    />
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                        Don't have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/sign-up"
                            underline="hover"
                        >
                            Sign Up
                        </Link>
                    </Typography>
                    <form.Subscribe
                        selector={(state) => state.isSubmitting}
                        children={(isSubmitting) => (
                            <Button
                                sx={{ marginLeft: "auto" }}
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Sign In
                            </Button>
                        )}
                    />
                </Stack>
            </Paper>
        </Container>
    );
}
