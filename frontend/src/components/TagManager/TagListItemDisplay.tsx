import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, Box, IconButton } from "@mui/material";

type TagListItemDisplayProps = {
    name: string;
    onDelete: () => void;
    onEditClick: () => void;
};

export function TagListItemDisplay({
    name,
    onDelete,
    onEditClick,
}: TagListItemDisplayProps) {
    return (
        <>
            <Chip
                label={`#${name}`}
                color="primary"
                size="small"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipses",
                    whiteSpace: "nowrap",
                }}
            />
            <Box component="span" sx={{ flexShrink: 0 }}>
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
                <IconButton onClick={onEditClick}>
                    <EditIcon />
                </IconButton>
            </Box>
        </>
    );
}
