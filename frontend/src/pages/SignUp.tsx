import {
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    Link,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Link as RouterLink, Navigate } from "react-router";
import { useSession } from "../SessionContext";

import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";

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

function fieldHasErrors(field: AnyFieldApi): boolean {
    return field.state.meta.isTouched && !field.state.meta.isValid;
}

function getFieldErrors(field: AnyFieldApi): string | null {
    return fieldHasErrors(field) ? field.state.meta.errors[0].message : null;
}

const passwordRules = [
    {
        label: "At least 8 characters",
        test: (val: string) => val.trim().length >= 8,
    },
    {
        label: "Contains an uppercase letter",
        test: (val: string) => /[A-Z]/.test(val),
    },
    {
        label: "Contains a number",
        test: (val: string) => /[0-9]/.test(val),
    },
    {
        label: "Contains a special character",
        test: (val: string) => /[^A-Za-z0-9]/.test(val),
    },
];

function PasswordErrorList({ password }: { password: string }) {
    return (
        <List>
            {passwordRules.map((rule) => {
                const hasPassed = rule.test(password);
                return (
                    <ListItem
                        dense
                        key={rule.label}
                        sx={{
                            color: (theme) =>
                                hasPassed
                                    ? theme.palette.success.dark
                                    : theme.palette.text.secondary,
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            {hasPassed ? <CheckIcon /> : <CloseIcon />}
                        </ListItemIcon>
                        <ListItemText primary={rule.label} />
                    </ListItem>
                );
            })}
        </List>
    );
}

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
        <Container maxWidth="sm" sx={{ mt: 6 }}>
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
                        name="username"
                        children={(field) => (
                            <TextField
                                margin="dense"
                                label="Username"
                                type="text"
                                fullWidth
                                variant="filled"
                                name="username"
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
                            <>
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
                            <TextField
                                margin="dense"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                variant="filled"
                                name="confirmPassword"
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
                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.preventDefault();
                                form.reset();
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            sx={{ marginLeft: "auto" }}
                            variant="contained"
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}
