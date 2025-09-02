import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useBookmarkSearch } from "../../hooks";
import { queryClient } from "../../http";
import {
    type BookmarkWithIndex,
    type Bookmark,
    type TagRepresentation,
} from "../../types";
import BookmarkSearchBar from "../BookmarkSearchBar";
import TagsAutocomplete from "../TagsAutocomplete";
import { BookmarkVirtualList } from "./BookmarkVirtualList";

type AddBookmarkToCollectionModalProps = {
    currentBookmarks: BookmarkWithIndex[];
    isOpen: boolean;
    onClose: () => void;
};

export default function AddBookmarksToCollectionModal({
    currentBookmarks,
    isOpen,
    onClose,
}: AddBookmarkToCollectionModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [chosenTags, setChosenTags] = useState<TagRepresentation[]>([]);
    const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([]);

    const params = useParams();
    const collectionId = Number(params.id);

    useEffect(() => {
        if (isOpen) {
            setSelectedBookmarks([]);
            setSearchQuery("");
            setChosenTags([]);
        }
    }, [isOpen]);

    const { data: allBookmarks } = useQuery({
        placeholderData: [],
        queryKey: ["bookmarks"],
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

    const { mutate, isPending: bookmarksMutationIsPending } = useMutation({
        mutationFn: async (bookmarkIds: number[]) => {
            const response = await fetch(
                `/api/collections/${collectionId}/bookmarks`,
                {
                    credentials: "include",
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bookmarkIds }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add bookmarks to collection");
            }
        },
        onSuccess: () => {
            console.log("Bookmarks successfully added");
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            onClose();
        },
    });

    const bookmarksNotInCollection = useMemo(() => {
        if (!allBookmarks) return [];
        return allBookmarks.filter(
            (bookmark) => !currentBookmarks.some((cb) => cb.id === bookmark.id)
        );
    }, [allBookmarks, currentBookmarks]);

    const bookmarksToDisplay = useBookmarkSearch({
        bookmarks: bookmarksNotInCollection,
        chosenTags,
        searchQuery,
    });

    const toggleBookmarkSelection = useCallback((bookmarkId: number) => {
        setSelectedBookmarks((prevBookmarkIds) => {
            if (prevBookmarkIds.includes(bookmarkId)) {
                return prevBookmarkIds.filter((id) => id !== bookmarkId);
            }
            return [...prevBookmarkIds, bookmarkId];
        });
    }, []);

    function handleConfirmClick() {
        const allIds = [
            ...currentBookmarks.map((bookmark) => bookmark.id),
            ...selectedBookmarks,
        ];
        mutate(allIds);
    }

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={onClose}
            closeAfterTransition={false}
        >
            <DialogTitle>Add bookmarks to collection</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <BookmarkSearchBar
                    searchQuery={searchQuery}
                    handleSearchQueryChange={setSearchQuery}
                />
                <TagsAutocomplete
                    chosenTags={chosenTags}
                    handleTagsChange={setChosenTags}
                    label="Filter by tags"
                />
                {allBookmarks && (
                    <BookmarkVirtualList
                        bookmarksToDisplay={bookmarksToDisplay}
                        selectedBookmarks={selectedBookmarks}
                        onToggleBookmark={toggleBookmarkSelection}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={bookmarksMutationIsPending}
                    color="primary"
                    onClick={handleConfirmClick}
                >
                    Add Bookmarks
                </Button>
            </DialogActions>
        </Dialog>
    );
}
