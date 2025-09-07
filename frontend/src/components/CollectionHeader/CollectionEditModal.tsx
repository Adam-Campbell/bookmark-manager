import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../../http";
import {
    type CollectionResourceBody,
    type CollectionWithBookmarks,
    type CollectionWithBookmarkCount,
} from "../../types";

type CollectionEditModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    id: number;
};

export function CollectionEditModal({
    isOpen,
    onClose,
    title,
    description,
    id,
}: CollectionEditModalProps) {
    const [collectionTitle, setCollectionTitle] = useState(title);
    const [collectionDescription, setCollectionDescription] =
        useState(description);

    const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(
        undefined
    );

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setCollectionTitle(title);
        setCollectionDescription(description);
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            title,
            description,
            id,
        }: CollectionResourceBody & { id: number }) => {
            const response = await fetch(`/api/collections/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to update collection");
            }
        },
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: ["collections", { id }],
            });
            const previousCollection: CollectionWithBookmarks | undefined =
                queryClient.getQueryData(["collections", { id }]);

            queryClient.setQueryData(["collections", { id }], {
                ...previousCollection,
                title: collectionTitle,
                description: collectionDescription,
            });
            await queryClient.cancelQueries({ queryKey: ["collections"] });
            const previousAllCollections:
                | CollectionWithBookmarkCount[]
                | undefined = queryClient.getQueryData(["collections"]);

            queryClient.setQueryData(
                ["collections"],
                previousAllCollections?.map((collection) => {
                    if (collection.id === id) {
                        return {
                            ...collection,
                            title: collectionTitle,
                            description: collectionDescription,
                        };
                    }
                    return collection;
                })
            );

            return { previousCollection, previousAllCollections };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData<CollectionWithBookmarks>(
                ["collections", { id }],
                context?.previousCollection
            );
            queryClient.setQueryData<CollectionWithBookmarkCount[]>(
                ["collections"],
                context?.previousAllCollections
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({
                queryKey: ["collections", { id }],
            });
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log({
            title,
            description,
            id,
        });
        mutate({
            title: collectionTitle,
            description: collectionDescription,
            id,
        });
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogContent>
                <form id={`edit-collection-form-${id}`} onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Title"
                        type="text"
                        fullWidth
                        variant="filled"
                        value={collectionTitle}
                        onChange={(e) => setCollectionTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="filled"
                        multiline
                        rows={4}
                        value={collectionDescription}
                        onChange={(e) =>
                            setCollectionDescription(e.target.value)
                        }
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    form={`edit-collection-form-${id}`}
                    disabled={isPending}
                >
                    Update Collection
                </Button>
            </DialogActions>
        </Dialog>
    );
}
