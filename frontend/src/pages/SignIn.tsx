import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Stack,
} from "@mui/material";
import { Link as RouterLink, Navigate } from "react-router";
import { useSession } from "../SessionContext";

export default function SignInPage() {
    const { signIn, isLoggedIn } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) {
            console.warn("Email and password are required");
            return;
        }
        await signIn(email, password);
    };

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
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="filled"
                        name="email"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="filled"
                        name="password"
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
