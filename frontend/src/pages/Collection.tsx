import AddIcon from "@mui/icons-material/Add";
import { Container, Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, type LoaderFunctionArgs } from "react-router";
import AddBookmarksToCollectionModal from "../components/AddBookmarksToCollectionModal";
import CollectionBookmarkList from "../components/CollectionBookmarkList";
import CollectionHeader from "../components/CollectionHeader";
import { queryClient, collectionQuery } from "../http";

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

            <CollectionBookmarkList
                id={id}
                bookmarks={collectionData.bookmarks}
            />
        </Container>
    );
}

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
    const id = Number(params.id);
    await queryClient.ensureQueryData(collectionQuery({ id }));
};
