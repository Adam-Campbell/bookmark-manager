import { useState, useMemo } from "react";
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
import Fuse from "fuse.js";

/**
 * Filters bookmarks by the selected tags.
 * @param bookmarks - The list of bookmarks to filter.
 * @param chosenTags - The tags to filter by.
 * @returns The filtered list of bookmarks - consisting of those bookmarks that contain every
 * tag in chosenTags within their tags array.
 */
function filterBookmarksByTags(
    bookmarks: Bookmark[],
    chosenTags: TagRepresentation[]
) {
    if (chosenTags.length === 0) return bookmarks;
    return bookmarks.filter((bookmark) =>
        // Return true if every tag in chosenTags is included in the bookmark's tags, else
        // return false.
        // The tags in chosenTags are of type TagRepresentation, while the tags in bookmarks
        // are of type Tag, but we can compare them via their ids.
        chosenTags.every((tagRepresentation) =>
            bookmark.tags.some(
                (tagObject) => tagRepresentation.id === tagObject.id
            )
        )
    );
}

export default function BookmarksPage() {
    const [chosenTags, setChosenTags] = useState<TagRepresentation[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [showFullDetail, setShowFullDetail] = useState(true);
    const [menuIsExpanded, setMenuIsExpanded] = useState(true);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["bookmarks"],
        placeholderData: [],
        staleTime: 10000, // 10 seconds
        queryFn: async (): Promise<Bookmark[]> => {
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

    const bookmarksToDisplay = useMemo(() => {
        const start = performance.now();
        const allBookmarks = data ?? [];
        let filteredBookmarks = filterBookmarksByTags(allBookmarks, chosenTags);
        if (searchQuery.trim() === "") {
            const end = performance.now();
            //console.log(`bookmarksToDisplay was created in ${end - start} ms`);
            return filteredBookmarks;
        }
        const fuse = new Fuse(filteredBookmarks, {
            keys: ["title", "description", "url"],
            includeScore: true,
        });
        const searchResults = fuse.search(searchQuery);
        const bookmarkResults = searchResults.map((result) => result.item);
        const end = performance.now();
        //console.log(`bookmarksToDisplay was created in ${end - start} ms`);
        return bookmarkResults;
    }, [data, chosenTags, searchQuery]);

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

                        <BookmarkSearchBar
                            searchQuery={searchQuery}
                            handleSearchQueryChange={setSearchQuery}
                        />
                        <TagsAutocomplete
                            chosenTags={chosenTags}
                            handleTagsChange={setChosenTags}
                        />
                    </Box>
                </Paper>
                <Paper variant="outlined">
                    <List>
                        {bookmarksToDisplay.map((bookmark, index) => (
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
