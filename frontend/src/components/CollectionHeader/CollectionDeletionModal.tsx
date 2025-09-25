import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { queryClient } from "../../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import { type CollectionWithBookmarkCount } from "../../types";

export function CollectionDeletionModal({
    isOpen,
    onClose,
    id,
}: {
    isOpen: boolean;
    onClose: () => void;
    id: number;
}) {
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/collections/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete collection");
            }
        },
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({
                queryKey: ["collections"],
            });
            const previousAllCollections:
                | CollectionWithBookmarkCount[]
                | undefined = queryClient.getQueryData(["collections"]);

            queryClient.setQueryData(
                ["collections"],
                previousAllCollections?.filter(
                    (collection) => collection.id !== id
                )
            );
            return { previousAllCollections };
        },
        onError: (_error, _id, context) => {
            queryClient.setQueryData(
                ["collections"],
                context?.previousAllCollections
            );
            showErrorSnackbar("Failed to delete collection");
        },
        onSuccess: () => {
            showSuccessSnackbar("Collection deleted");
        },
        onSettled: (_data, _error, id) => {
            onClose();
            queryClient.invalidateQueries({
                queryKey: ["collections"],
                exact: true,
            });
            // We remove rather than invalidate the query for the specific collection
            // because we don't want it to be refetched after deletion
            queryClient.removeQueries({ queryKey: ["collections", { id }] });
            navigate("/collections");
        },
    });

    function handleDeleteClick() {
        mutate(id);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            closeAfterTransition={false}
            slotProps={{
                paper: {
                    elevation: 6,
                },
            }}
        >
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this collection? This action
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
