import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { useBookmarkSearch } from "../../hooks";
import { queryClient, bookmarksQuery } from "../../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import { type BookmarkWithIndex, type TagRepresentation } from "../../types";
import BookmarkSearchBar from "../BookmarkSearchBar";
import EmptyListDisplay from "../EmptyListDisplay";
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
    const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(
        undefined
    );

    const params = useParams();
    const collectionId = Number(params.id);

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setSelectedBookmarks([]);
        setSearchQuery("");
        setChosenTags([]);
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    const { data: allBookmarks } = useQuery(
        bookmarksQuery({
            shouldShowSnackbar: true,
        })
    );

    const {
        mutate: addBookmarksMutation,
        isPending: addBookmarksMutationIsPending,
    } = useMutation({
        mutationFn: async ({
            bookmarkIds,
            collectionId,
        }: {
            bookmarkIds: number[];
            collectionId: number;
        }) => {
            const response = await fetch(
                `/api/collections/${collectionId}/bookmarks`,
                {
                    credentials: "include",
                    method: "POST",
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
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            onClose();
            showSuccessSnackbar("Bookmarks added");
        },
        onError: () => {
            showErrorSnackbar("Failed to add bookmarks");
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
        addBookmarksMutation({
            bookmarkIds: selectedBookmarks,
            collectionId,
        });
    }

    if (!allBookmarks) {
        return null;
    }

    let innerContent;

    if (allBookmarks.length === 0) {
        innerContent = (
            <EmptyListDisplay
                message="It looks like you haven't created any bookmarks yet."
                displayInline
            />
        );
    } else if (currentBookmarks.length === allBookmarks.length) {
        innerContent = (
            <EmptyListDisplay
                message="You have already added all bookmarks to this collection."
                displayInline
            />
        );
    } else if (bookmarksToDisplay.length === 0) {
        innerContent = (
            <EmptyListDisplay
                message="No matching bookmarks."
                extraInfo="Try adjusting your search query or tag filters."
                displayInline
            />
        );
    } else {
        innerContent = (
            <BookmarkVirtualList
                bookmarksToDisplay={bookmarksToDisplay}
                selectedBookmarks={selectedBookmarks}
                onToggleBookmark={toggleBookmarkSelection}
            />
        );
    }

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={onClose}
            closeAfterTransition={false}
            slotProps={{
                paper: {
                    elevation: 6,
                },
            }}
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
                {innerContent}
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={addBookmarksMutationIsPending}
                    color="primary"
                    onClick={handleConfirmClick}
                >
                    Add Bookmarks
                </Button>
            </DialogActions>
        </Dialog>
    );
}
