import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { IconButton } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../snackbarStore";
import { type Bookmark } from "../types";
import BookmarkListItem from "./BookmarkListItem";

type RemovableBookmarkListItemProps = {
    bookmark: Bookmark;
    collectionId: number;
    includeBorder?: boolean;
};

export default function RemovableBookmarkListItem({
    bookmark,
    collectionId,
    includeBorder,
}: RemovableBookmarkListItemProps) {
    const { mutate: removeBookmarkMutation } = useMutation({
        mutationFn: async ({
            bookmarkId,
            collectionId,
        }: {
            bookmarkId: number;
            collectionId: number;
        }) => {
            const response = await fetch(
                `/api/collections/${collectionId}/bookmarks/${bookmarkId}`,
                {
                    credentials: "include",
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to remove bookmark");
            }
        },
        onError: () => {
            showErrorSnackbar("Failed to remove bookmark");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            showSuccessSnackbar("Bookmark removed");
        },
    });

    function handleRemoveClick() {
        removeBookmarkMutation({
            bookmarkId: bookmark.id,
            collectionId,
        });
    }

    return (
        <BookmarkListItem
            bookmark={bookmark}
            includeBorder={includeBorder}
            showFullDetail={true}
            controls={
                <IconButton onClick={handleRemoveClick}>
                    <RemoveCircleIcon />
                </IconButton>
            }
        />
    );
}
