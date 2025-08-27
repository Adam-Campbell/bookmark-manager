import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import {
    type Bookmark,
    type TagRepresentation,
    type BookmarkResourceBody,
    type BookmarkWithCollections,
} from "../../types";
import TagsAutocomplete from "../TagsAutocomplete";
import { queryClient } from "../../http";

export function BookmarkEditModal({
    bookmark,
    isOpen,
    onClose,
}: {
    bookmark: Bookmark;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [bookmarkTitle, setBookmarkTitle] = useState(bookmark.title);
    const [bookmarkUrl, setBookmarkUrl] = useState(bookmark.url);
    const [bookmarkDescription, setBookmarkDescription] = useState(
        bookmark.description
    );
    const [bookmarkTags, setBookmarkTags] = useState<TagRepresentation[]>(
        bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name }))
    );

    useEffect(() => {
        if (isOpen) {
            setBookmarkTitle(bookmark.title);
            setBookmarkUrl(bookmark.url);
            setBookmarkDescription(bookmark.description);
            setBookmarkTags(
                bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name }))
            );
        }
    }, [isOpen]);

    const { mutate } = useMutation({
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
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log({
        //     title: bookmarkTitle,
        //     url: bookmarkUrl,
        //     description: bookmarkDescription,
        //     tags: bookmarkTags,
        // });
        mutate({
            title: bookmarkTitle,
            url: bookmarkUrl,
            description: bookmarkDescription,
            tags: bookmarkTags,
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} closeAfterTransition={false}>
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogContent>
                <form
                    id={`edit-bookmark-${bookmark.id}`}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bookmark Title"
                        type="text"
                        fullWidth
                        variant="filled"
                        value={bookmarkTitle}
                        onChange={(e) => setBookmarkTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Bookmark URL"
                        type="url"
                        fullWidth
                        variant="filled"
                        value={bookmarkUrl}
                        onChange={(e) => setBookmarkUrl(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="filled"
                        multiline
                        rows={4}
                        value={bookmarkDescription}
                        onChange={(e) => setBookmarkDescription(e.target.value)}
                    />
                    <TagsAutocomplete
                        chosenTags={bookmarkTags}
                        handleTagsChange={setBookmarkTags}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button form={`edit-bookmark-${bookmark.id}`} type="submit">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
