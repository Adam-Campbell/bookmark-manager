import AddIcon from "@mui/icons-material/Add";
import { Container, Box, List, Paper, Button } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, type LoaderFunctionArgs } from "react-router";
import AddBookmarksToCollectionModal from "../components/AddBookmarksToCollectionModal";
import CollectionHeader from "../components/CollectionHeader";
import RemovableBookmarkListItem from "../components/RemovableBookmarkListItem";
import { queryClient } from "../http";
import { type CollectionWithBookmarks } from "../types";

export default function CollectionPage() {
    const params = useParams();
    const [addBookmarksModalIsOpen, setAddBookmarksModalIsOpen] =
        useState(false);

    const id = Number(params.id);

    const { data: collection } = useQuery({
        queryKey: ["collections", { id }],
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryFn: async ({ signal }) => {
            const response = await fetch(`/api/collections/${id}`, {
                credentials: "include",
                signal,
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collection");
            }
            const collection: CollectionWithBookmarks = await response.json();
            return collection;
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (bookmarkIds: number[]) => {
            const response = await fetch(`/api/collections/${id}/bookmarks`, {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookmarkIds }),
            });
            if (!response.ok) {
                throw new Error("Failed to remove bookmark from collection");
            }
        },
        onSuccess: () => {
            console.log("Bookmark successfully removed");
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });

    function handleRemoveBookmark(bookmarkId: number) {
        const bookmarks = collection?.bookmarks ?? [];
        const updatedBookmarkIds = bookmarks
            .map((bookmark) => bookmark.id)
            .filter((id) => id !== bookmarkId);
        mutate(updatedBookmarkIds);
    }

    if (!collection) {
        return null;
    }

    console.log(collection);

    return (
        <Container sx={{ py: 6 }}>
            <CollectionHeader
                title={collection.title}
                description={collection.description}
                id={collection.id}
                bookmarkCount={collection.bookmarks.length}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-end" },
                    alignItems: "center",
                    py: 2,
                    px: 0,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: { xs: "100%", sm: "initial" } }}
                    startIcon={<AddIcon />}
                    onClick={() => setAddBookmarksModalIsOpen(true)}
                >
                    Add Bookmarks
                </Button>
            </Box>
            <AddBookmarksToCollectionModal
                currentBookmarks={collection.bookmarks}
                isOpen={addBookmarksModalIsOpen}
                onClose={() => setAddBookmarksModalIsOpen(false)}
            />
            <Paper variant="outlined">
                <List>
                    {collection.bookmarks.map((bookmark, index) => (
                        <RemovableBookmarkListItem
                            key={bookmark.id}
                            bookmark={bookmark}
                            includeBorder={index !== 0}
                            handleRemoveClick={() =>
                                handleRemoveBookmark(bookmark.id)
                            }
                        />
                    ))}
                </List>
            </Paper>
        </Container>
    );
}

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    await queryClient.ensureQueryData({
        queryKey: ["collections", { id: Number(id) }],
        queryFn: async () => {
            const response = await fetch(`/api/collections/${id}`, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collection");
            }
            const collection: CollectionWithBookmarks = await response.json();
            return collection;
        },
    });
};
