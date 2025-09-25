import {
    Container,
    Paper,
    Stack,
    Typography,
    Button,
    Link,
    Box,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { Link as RouterLink, Navigate } from "react-router";
import { z } from "zod";
import FormTextField from "../components/FormTextField";
import PasswordErrorList from "../components/PasswordErrorList";
import { useSession } from "../SessionContext";
import { fieldHasErrors } from "../utils";

const SignUpSchema = z
    .object({
        email: z.email("Please enter a valid email address"),
        username: z.string().trim().min(1, "Please enter a username"),
        password: z
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
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const signUpDefaultValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
};

export default function SignUpPage() {
    const { signUp, isLoggedIn } = useSession();

    const form = useForm({
        defaultValues: signUpDefaultValues,
        validators: {
            onChange: SignUpSchema,
        },
        onSubmit: async ({ value, formApi }) => {
            console.log("Submit was called");
            const { email, password, username } = value;
            try {
                await signUp(email, password, username);
            } catch (error) {
                formApi.setFieldMeta("email", (meta) => ({
                    ...meta,
                    errorMap: {
                        onChange: [
                            {
                                message:
                                    "An account with this email already exists",
                            },
                        ],
                    },
                }));
            }
        },
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log("handleFormSubmit was called");
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
                <Stack
                    component="form"
                    method="post"
                    onSubmit={handleFormSubmit}
                >
                    <Typography variant="h5" component="h1" gutterBottom>
                        Sign Up
                    </Typography>
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
                        name="username"
                        children={(field) => (
                            <FormTextField field={field} label="Username" />
                        )}
                    />
                    <form.Field
                        name="password"
                        children={(field) => (
                            <>
                                <FormTextField
                                    field={field}
                                    label="Password"
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
                        name="confirmPassword"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Confirm Password"
                                type="password"
                            />
                        )}
                    />
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                        Already have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/sign-in"
                            underline="hover"
                        >
                            Sign In
                        </Link>
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <form.Subscribe
                            selector={(state) => state.isSubmitting}
                            children={(isSubmitting) => (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            form.reset();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        sx={{ marginLeft: "auto" }}
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        />
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}
