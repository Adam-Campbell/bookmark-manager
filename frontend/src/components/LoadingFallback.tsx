import { Box, CircularProgress } from "@mui/material";

export default function LoadingFallback() {
    return (
        <Box
            sx={{
                position: "relative",
                top: "calc(50vh - 100px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress size="4rem" />
        </Box>
    );
}
