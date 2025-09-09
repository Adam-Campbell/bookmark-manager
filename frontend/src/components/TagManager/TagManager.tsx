import { Paper, List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { tagsQuery, transformTagsToTagRepresentations } from "../../http";
import { TagListItem } from "./TagListItem";

export default function TagManager() {
    const { data: tagsData } = useQuery(
        tagsQuery({
            select: transformTagsToTagRepresentations,
        })
    );

    if (!tagsData) {
        return null;
    }

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Tags
            </Typography>
            <List disablePadding>
                {tagsData.map((tag, index) => {
                    if (tag.id === null) return null;
                    return (
                        <TagListItem
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            includeBorder={index !== 0}
                        />
                    );
                })}
            </List>
        </Paper>
    );
}
