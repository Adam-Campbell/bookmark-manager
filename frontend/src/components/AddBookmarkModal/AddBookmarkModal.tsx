import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";

import { queryClient } from "../../http";
import { useModal } from "../../ModalContext";
import { useSession } from "../../SessionContext";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import {
    type TagRepresentation,
    type CollectionRepresentation,
    type BookmarkResourceBody,
} from "../../types";
import FormTextField from "../FormTextField";
import TagsAutocomplete from "../TagsAutocomplete";
import { CollectionsAutocomplete } from "./CollectionsAutocomplete";

const BookmarkSchema = z.object({
    title: z
        .string()
        .min(1, "Please provide a bookmark title")
        .max(150, "Bookmark title cannot exceed 150 characters"),
    url: z
        .url("Please provide a valid bookmark URL")
        .max(2048, "Bookmark URL cannot exceed 2048 characters"),
    description: z
        .string()
        .min(1, "Please provide a bookmark description")
        .max(500, "Bookmark description cannot exceed 500 characters"),
    tags: z.array(
        z.object({
            id: z.number().nullable(),
            name: z.string().min(1).max(60, "Tags cannot exceed 60 characters"),
        })
    ),
    collections: z.array(
        z.object({
            id: z.number(),
            title: z.string().min(1).max(150),
        })
    ),
});

const addBookmarkDefaultValues: {
    title: string;
    url: string;
    description: string;
    tags: TagRepresentation[];
    collections: CollectionRepresentation[];
} = {
    title: "",
    url: "",
    description: "",
    tags: [],
    collections: [],
};

export default function AddBookmarkModal() {
    const { activeModal, closeModal } = useModal();
    const { isLoggedIn } = useSession();

    const { mutate: addBookmarkMutation, isPending: submissionPending } =
        useMutation({
            mutationFn: async (bookmarkData: BookmarkResourceBody) => {
                const response = await fetch("/api/bookmarks", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookmarkData),
                });
                if (!response.ok) {
                    throw new Error("Failed to add bookmark");
                }
                const bookmark = await response.json();
                return bookmark;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
                queryClient.invalidateQueries({ queryKey: ["tags"] });
                queryClient.invalidateQueries({ queryKey: ["collections"] });
                closeModal();
                showSuccessSnackbar("Bookmark added");
            },
            onError: () => {
                showErrorSnackbar("Failed to add bookmark");
            },
        });

    const form = useForm({
        defaultValues: addBookmarkDefaultValues,
        validators: {
            onChange: BookmarkSchema,
        },
        onSubmit: async ({ value }) => {
            const { title, url, description, tags, collections } = value;

            addBookmarkMutation({
                title,
                url,
                description,
                tags,
                collections,
            });
        },
    });

    useEffect(() => {
        if (activeModal === "addBookmark") {
            form.reset();
        }
    }, [activeModal]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <Dialog
            open={activeModal === "addBookmark"}
            onClose={closeModal}
            closeAfterTransition={false}
        >
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogContent>
                <form id="add-bookmark-form" onSubmit={handleSubmit}>
                    <form.Field
                        name="title"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Bookmark Title"
                                shouldAutoFocus
                            />
                        )}
                    />
                    <form.Field
                        name="url"
                        children={(field) => (
                            <FormTextField
                                field={field}
                                label="Bookmark URL"
                                type="url"
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
                    <form.Field
                        name="tags"
                        children={(field) => (
                            <TagsAutocomplete
                                chosenTags={field.state.value}
                                handleTagsChange={field.handleChange}
                            />
                        )}
                    />
                    <form.Field
                        name="collections"
                        children={(field) => (
                            <CollectionsAutocomplete
                                chosenCollections={field.state.value}
                                handleCollectionsChange={field.handleChange}
                            />
                        )}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={closeModal}>
                    Cancel
                </Button>
                <Button
                    disabled={submissionPending}
                    color="primary"
                    type="submit"
                    form="add-bookmark-form"
                >
                    {submissionPending ? (
                        <CircularProgress size={20} />
                    ) : (
                        "Add Bookmark"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
