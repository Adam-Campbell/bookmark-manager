import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

export function NavLogo() {
    return (
        <Box
            component={RouterLink}
            to="/"
            sx={{
                display: "flex",
                alignItems: "center",
                mr: "auto",
                color: (theme) => theme.palette.primary.contrastText,
                textDecoration: "none",
            }}
        >
            <CollectionsBookmarkIcon />
            <Typography sx={{ ml: 1 }} variant="h6" component="span">
                Shelf
            </Typography>
        </Box>
    );
}
