import { Paper, List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type Tag, type TagRepresentation } from "../../types";
import { TagListItem } from "./TagListItem";

export default function TagManager() {
    const { data: tagsData } = useQuery({
        placeholderData: [],
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await fetch("/api/tags", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }
            const tags: Tag[] = await response.json();
            return tags;
        },
        select: (tags: Tag[]): TagRepresentation[] => {
            return tags.map((tag) => ({ id: tag.id, name: tag.name }));
        },
    });

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
