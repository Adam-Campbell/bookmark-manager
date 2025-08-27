import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../http";
import { type Bookmark } from "../../types";

type BookmarkDeletionDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    bookmarkId: number;
};

export function BookmarkDeletionDialog({
    isOpen,
    onClose,
    bookmarkId,
}: BookmarkDeletionDialogProps) {
    const { mutate } = useMutation({
        mutationFn: async (bookmarkId: number) => {
            const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete bookmark");
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
            const previousBookmarks = queryClient.getQueryData<Bookmark[]>([
                "bookmarks",
            ]);
            queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old) =>
                old ? old.filter((b) => b.id !== bookmarkId) : []
            );
            return { previousBookmarks };
        },
        onError: (_error, _bookmarkId, context) => {
            queryClient.setQueryData<Bookmark[]>(
                ["bookmarks"],
                context?.previousBookmarks
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });

    const handleDeleteClick = () => {
        mutate(bookmarkId);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this bookmark? This action
                cannot be undone.
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleDeleteClick}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}
