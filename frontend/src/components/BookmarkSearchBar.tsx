import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export function BookmarkSearchBar() {
    return (
        <Box display="flex" alignItems="center" mb={2}>
            <TextField
                label="Search bookmarks"
                variant="filled"
                size="small"
                aria-label="Search bookmarks"
                type="text"
                sx={{ flexGrow: 1, mr: 1 }}
            />
            <IconButton color="primary" aria-label="Search bookmarks">
                <SearchIcon />
            </IconButton>
        </Box>
    );
}
