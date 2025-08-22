import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Paper, List } from "@mui/material";
import { BookmarkSearchBar } from "../components/BookmarkSearchBar";
import BookmarkListItem from "../components/BookmarkListItem";
import { type Bookmark } from "../types";
import TagsAutocomplete, {
    type TagRepresentation,
} from "../components/TagsAutocomplete";

export default function BookmarksPage() {
    const [chosenTags, setChosenTags] = useState<TagRepresentation[]>([]);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const response = await fetch("/api/bookmarks", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch bookmarks");
            }
            const bookmarks: Bookmark[] = await response.json();
            return bookmarks;
        },
    });

    console.log(data);

    if (!data) {
        return null;
    }

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                <BookmarkSearchBar />
                <TagsAutocomplete
                    chosenTags={chosenTags}
                    handleTagsChange={setChosenTags}
                />
                <Paper variant="outlined">
                    <List>
                        {data.map((bookmark, index) => (
                            <BookmarkListItem
                                key={bookmark.id}
                                bookmark={bookmark}
                                includeBorder={index !== 0}
                            />
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
}
