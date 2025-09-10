import AddIcon from "@mui/icons-material/Add";
import { Container, Box, List, Paper, Button } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, type LoaderFunctionArgs } from "react-router";
import AddBookmarksToCollectionModal from "../components/AddBookmarksToCollectionModal";
import CollectionHeader from "../components/CollectionHeader";
import RemovableBookmarkListItem from "../components/RemovableBookmarkListItem";
import { queryClient, collectionQuery } from "../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../snackbarStore";

export default function CollectionPage() {
    const params = useParams();
    const [addBookmarksModalIsOpen, setAddBookmarksModalIsOpen] =
        useState(false);

    const id = Number(params.id);

    const { data: collectionData } = useQuery(
        collectionQuery({
            id,
            shouldShowSnackbar: true,
        })
    );

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
            showSuccessSnackbar("Bookmark removed");
        },
        onError: () => {
            showErrorSnackbar("Failed to remove bookmark");
        },
    });

    function handleRemoveBookmark(bookmarkId: number) {
        const bookmarks = collectionData?.bookmarks ?? [];
        const updatedBookmarkIds = bookmarks
            .map((bookmark) => bookmark.id)
            .filter((id) => id !== bookmarkId);
        mutate(updatedBookmarkIds);
    }

    if (!collectionData) {
        return null;
    }

    return (
        <Container sx={{ py: 6 }}>
            <CollectionHeader
                title={collectionData.title}
                description={collectionData.description}
                id={collectionData.id}
                bookmarkCount={collectionData.bookmarks.length}
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
                currentBookmarks={collectionData.bookmarks}
                isOpen={addBookmarksModalIsOpen}
                onClose={() => setAddBookmarksModalIsOpen(false)}
            />
            <Paper variant="outlined">
                <List>
                    {collectionData.bookmarks.map((bookmark, index) => (
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
    const id = Number(params.id);
    await queryClient.ensureQueryData(collectionQuery({ id }));
};
