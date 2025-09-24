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
    type Bookmark,
    type BookmarkResourceBody,
    type BookmarkWithCollections,
    type TagRepresentation,
} from "../../types";
import FormTextField from "../FormTextField";
import TagsAutocomplete from "../TagsAutocomplete";

const EditBookmarkSchema = z.object({
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
});

function getFormattedBookmark(bookmark: Bookmark): {
    title: string;
    url: string;
    description: string;
    tags: TagRepresentation[];
} {
    return {
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        tags: bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
}

export function BookmarkEditModal({
    bookmark,
    isOpen,
    onClose,
}: {
    bookmark: Bookmark;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(
        undefined
    );

    const { mutateAsync: editBookmarkMutation } = useMutation({
        mutationFn: async ({
            title,
            description,
            url,
            tags,
        }: BookmarkResourceBody): Promise<BookmarkWithCollections> => {
            const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, url, tags }),
            });
            if (!response.ok) {
                throw new Error("Failed to update bookmark");
            }
            const updatedBookmark = await response.json();
            return updatedBookmark;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            onClose();
            showSuccessSnackbar("Bookmark updated");
        },
        onError: () => {
            showErrorSnackbar("Failed to update bookmark");
        },
    });

    const form = useForm({
        defaultValues: getFormattedBookmark(bookmark),
        validators: {
            onChange: EditBookmarkSchema,
        },
        onSubmit: async ({ value }) => {
            const { title, url, description, tags } = value;
            await editBookmarkMutation({ title, url, description, tags });
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        form.reset();
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogContent>
                <form
                    id={`edit-bookmark-${bookmark.id}`}
                    onSubmit={handleSubmit}
                >
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

                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <form.Subscribe
                    selector={(state) => state.isSubmitting}
                    children={(isSubmitting) => (
                        <Button
                            form={`edit-bookmark-${bookmark.id}`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Save
                        </Button>
                    )}
                />
            </DialogActions>
        </Dialog>
    );
}
