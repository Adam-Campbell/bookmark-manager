import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Box,
    Container,
    Paper,
    List,
    FormControlLabel,
    Switch,
    Button,
} from "@mui/material";
import { BookmarkSearchBar } from "../components/BookmarkSearchBar";
import BookmarkListItem from "../components/BookmarkListItem";
import { type Bookmark } from "../types";
import TagsAutocomplete from "../components/TagsAutocomplete";
import { type TagRepresentation } from "../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { queryClient } from "../http";

export default function BookmarksPage() {
    const [chosenTags, setChosenTags] = useState<TagRepresentation[]>([]);
    const [showFullDetail, setShowFullDetail] = useState(true);
    const [menuIsExpanded, setMenuIsExpanded] = useState(true);

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

    const bookmarks = data || [];

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Paper
                    sx={{
                        p: 2,
                        mb: 4,
                        position: "sticky",
                        top: 80,
                        zIndex: 1000,
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Button
                            onClick={() => setMenuIsExpanded(!menuIsExpanded)}
                            disableRipple
                            endIcon={
                                menuIsExpanded ? (
                                    <ExpandLessIcon />
                                ) : (
                                    <ExpandMoreIcon />
                                )
                            }
                        >
                            {menuIsExpanded ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </Box>
                    <Box sx={{ display: menuIsExpanded ? "block" : "none" }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showFullDetail}
                                    onChange={() =>
                                        setShowFullDetail(!showFullDetail)
                                    }
                                />
                            }
                            label="Show full bookmark detail"
                        />

                        <BookmarkSearchBar />
                        <TagsAutocomplete
                            chosenTags={chosenTags}
                            handleTagsChange={setChosenTags}
                        />
                    </Box>
                </Paper>
                <Paper variant="outlined">
                    <List>
                        {bookmarks.map((bookmark, index) => (
                            <BookmarkListItem
                                key={bookmark.id}
                                bookmark={bookmark}
                                includeBorder={index !== 0}
                                showFullDetail={showFullDetail}
                            />
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
}

export const bookmarksLoader = async () => {
    await queryClient.ensureQueryData({
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
};
