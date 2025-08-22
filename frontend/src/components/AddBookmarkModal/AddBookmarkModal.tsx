import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { useBookmarkModal } from "../../BookmarkModalContext";
import {
    type CollectionRepresentation,
    type BookmarkResourceBody,
} from "./types";
import { CollectionsAutocomplete } from "./CollectionsAutocomplete";
import { useSession } from "../../SessionContext";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../http";
import TagsAutocomplete, { type TagRepresentation } from "../TagsAutocomplete";

export default function AddBookmarkModal() {
    const { isOpen, closeModal } = useBookmarkModal();
    const [bookmarkTitle, setBookmarkTitle] = useState("");
    const [bookmarkUrl, setBookmarkUrl] = useState("");
    const [bookmarkDescription, setBookmarkDescription] = useState("");
    const [chosenTags, setChosenTags] = useState<TagRepresentation[]>([]);
    const [chosenCollections, setChosenCollections] = useState<
        CollectionRepresentation[]
    >([]);

    const { isLoggedIn } = useSession();

    const { mutate, isPending: submissionPending } = useMutation({
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
            console.log("Bookmark successfully added");
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            closeModal();
        },
    });

    useEffect(() => {
        if (isOpen) {
            setBookmarkTitle("");
            setBookmarkUrl("");
            setBookmarkDescription("");
            setChosenTags([]);
            setChosenCollections([]);
        }
    }, [isOpen]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const bookmarkData = {
            title: bookmarkTitle,
            url: bookmarkUrl,
            description: bookmarkDescription,
            tags: chosenTags,
            collections: chosenCollections,
        };
        mutate(bookmarkData);
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <Dialog open={isOpen} onClose={closeModal} closeAfterTransition={false}>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogContent>
                <form id="add-bookmark-form" onSubmit={handleSubmit}>
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
                        chosenTags={chosenTags}
                        handleTagsChange={setChosenTags}
                    />
                    <CollectionsAutocomplete
                        chosenCollections={chosenCollections}
                        handleCollectionsChange={setChosenCollections}
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
