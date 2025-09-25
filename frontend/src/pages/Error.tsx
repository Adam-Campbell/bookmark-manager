import {
    useRouteError,
    isRouteErrorResponse,
    Link as RouterLink,
} from "react-router";
import { Typography, Container, Button } from "@mui/material";

function getMessage(status: number): string {
    const statusMessageMap: Record<number, string> = {
        400: "The page address is invalid. Please check the link and try again.",
        401: "You must sign in before continuing.",
        403: "You are not permitted to access this resource.",
        404: "The requested resource could not be found.",
        500: "Something went wrong on our end. Please try again later.",
    };

    return statusMessageMap[status] ?? "An unknown error occurred.";
}

export default function ErrorPage() {
    const error = useRouteError();

    const errorData = isRouteErrorResponse(error)
        ? { status: error.status, message: getMessage(error.status) }
        : { status: "Error", message: "An unknown error occurred." };

    return (
        <Container
            maxWidth="lg"
            sx={{
                minHeight: ["100dvh", "100vh"],
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Typography variant="h1">{errorData.status}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {errorData.message}
            </Typography>
            {errorData.status === 401 ? (
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/sign-in"
                >
                    Sign In
                </Button>
            ) : (
                <Button variant="contained" component={RouterLink} to="/">
                    Return Home
                </Button>
            )}
        </Container>
    );
}
