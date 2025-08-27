import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function BookmarkSearchBar({
    searchQuery,
    handleSearchQueryChange,
}: {
    searchQuery: string;
    handleSearchQueryChange: (value: string) => void;
}) {
    return (
        <Box display="flex" alignItems="center" mb={2}>
            <TextField
                label="Search bookmarks"
                variant="filled"
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
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
