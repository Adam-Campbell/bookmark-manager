import {
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useSession } from "../SessionContext";

export default function SignUpPage() {
    const { signUp } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        if (!email || !username || !password) {
            console.warn("Email, username, and password are required");
            return;
        }
        await signUp(email, password, username);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack component="form" method="post" onSubmit={handleSubmit}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Sign Up
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
                        autoFocus
                        required
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="filled"
                        name="username"
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
                        Already have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/sign-in"
                            underline="hover"
                        >
                            Sign In
                        </Link>
                    </Typography>
                    <Button
                        sx={{ marginLeft: "auto" }}
                        variant="contained"
                        type="submit"
                    >
                        Sign Up
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
