import {
    Box,
    Chip,
    IconButton,
    ListItem,
    Typography,
    Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import { type Bookmark } from "../types";

export default function BookmarkListItem({
    bookmark,
    includeBorder,
}: {
    bookmark: Bookmark;
    includeBorder?: boolean;
}) {
    const { title, url, description, tags } = bookmark;
    return (
        <ListItem
            sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                borderTop: (theme) =>
                    includeBorder
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
            }}
        >
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                width="100%"
            >
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        fontSize: {
                            xs: "1rem",
                            sm: "1.125rem",
                        },
                        fontWeight: "bold",
                    }}
                >
                    {title}
                </Typography>
                <Box component="span" ml={{ xs: -1, sm: 0 }}>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                        <IconButton size="small">
                            <LaunchIcon />
                        </IconButton>
                    </Link>
                    <IconButton size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
            <Typography sx={{ mb: 1 }} variant="body2" color="text.secondary">
                {description}
            </Typography>
            <Box sx={{ ml: -1 }}>
                {tags?.map((tag) => (
                    <Chip
                        key={tag.id}
                        label={`#${tag.name}`}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                ))}
            </Box>
        </ListItem>
    );
}
