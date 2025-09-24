import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { queryClient } from "../../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import {
    type CollectionResourceBody,
    type CollectionWithBookmarks,
    type CollectionWithBookmarkCount,
} from "../../types";
import FormTextField from "../FormTextField";

const CollectionEditSchema = z.object({
    title: z
        .string()
        .min(1, "Please provide a collection title")
        .max(150, "Collection title cannot exceed 150 characters"),
    description: z
        .string()
        .min(2, "Please provide a collection description")
        .max(500, "Collection description cannot exceed 500 characters"),
});

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
    const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(
        undefined
    );

    const { mutateAsync: editCollectionMutation } = useMutation({
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
                title,
                description,
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
                            title,
                            description,
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
            showErrorSnackbar("Failed to update collection");
        },
        onSuccess: () => {
            showSuccessSnackbar("Collection updated");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({
                queryKey: ["collections", { id }],
            });
        },
    });

    const form = useForm({
        defaultValues: {
            title,
            description,
        },
        validators: {
            onChange: CollectionEditSchema,
        },
        onSubmit: async ({ value }) => {
            const { title, description } = value;
            await editCollectionMutation({
                title,
                description,
                id,
            });
            onClose();
        },
    });

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        form.reset();
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogContent>
                <form id={`edit-collection-form-${id}`} onSubmit={handleSubmit}>
                    <form.Field
                        name="title"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Collection Title"
                                shouldAutoFocus
                            />
                        )}
                    />
                    <form.Field
                        name="description"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Description"
                                isTextArea
                            />
                        )}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <form.Subscribe
                    selector={(state) => state.isSubmitting}
                    children={(isSubmitting) => (
                        <Button
                            color="primary"
                            variant="outlined"
                            sx={{ mr: "auto" }}
                            disabled={isSubmitting}
                            onClick={(e) => {
                                e.preventDefault();
                                form.reset();
                            }}
                        >
                            Reset
                        </Button>
                    )}
                />

                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <form.Subscribe
                    selector={(state) => state.isSubmitting}
                    children={(isSubmitting) => (
                        <Button
                            type="submit"
                            color="primary"
                            form={`edit-collection-form-${id}`}
                            disabled={isSubmitting}
                        >
                            Update Collection
                        </Button>
                    )}
                />
            </DialogActions>
        </Dialog>
    );
}
