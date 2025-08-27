import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, FormControlLabel, Switch } from "@mui/material";
import Fuse from "fuse.js";
import { queryClient } from "../http";
import StickyPanel from "../components/SitckyPanel";
import BookmarkSearchBar from "../components/BookmarkSearchBar";
import TagsAutocomplete from "../components/TagsAutocomplete";
import BookmarkList from "../components/BookmarkList";
import { type Bookmark, type TagRepresentation } from "../types";

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

    const [isShowingFullDetail, setIsShowingFullDetail] = useState(true);

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["bookmarks"],
        placeholderData: [],
        staleTime: 5 * 60 * 1000, // 5 minutes
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
        const allBookmarks = data ?? [];
        let filteredBookmarks = filterBookmarksByTags(allBookmarks, chosenTags);
        if (searchQuery.trim() === "") {
            return filteredBookmarks;
        }
        const fuse = new Fuse(filteredBookmarks, {
            keys: ["title", "description", "url"],
            includeScore: true,
        });
        const searchResults = fuse.search(searchQuery);
        const bookmarkResults = searchResults.map((result) => result.item);
        return bookmarkResults;
    }, [data, chosenTags, searchQuery]);

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <StickyPanel
                    isOpenLabel="Hide Filters"
                    isClosedLabel="Show Filters"
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isShowingFullDetail}
                                onChange={() =>
                                    setIsShowingFullDetail(!isShowingFullDetail)
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
                        label="Filter by Tags"
                    />
                </StickyPanel>
                <BookmarkList
                    bookmarksToDisplay={bookmarksToDisplay}
                    showFullDetail={isShowingFullDetail}
                    userHasBookmarks={Boolean(data?.length)}
                />
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
