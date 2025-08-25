import { Box, Chip } from "@mui/material";
import { type Tag } from "../../types";

export function BookmarkTags({ tags }: { tags: Tag[] }) {
    return (
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
    );
}
