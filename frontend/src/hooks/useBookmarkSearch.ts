import { useMemo } from "react";
import Fuse from "fuse.js";
import { type Bookmark, type TagRepresentation } from "../types";

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

type useBookmarkSearchOptions = {
    bookmarks: Bookmark[];
    chosenTags: TagRepresentation[];
    searchQuery: string;
};

export function useBookmarkSearch({
    bookmarks,
    chosenTags,
    searchQuery,
}: useBookmarkSearchOptions) {
    const bookmarksToDisplay = useMemo(() => {
        let filteredBookmarks = filterBookmarksByTags(bookmarks, chosenTags);
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
    }, [bookmarks, chosenTags, searchQuery]);
    return bookmarksToDisplay;
}
