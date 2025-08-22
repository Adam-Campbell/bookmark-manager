import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { useBookmarkModal } from "../../BookmarkModalContext";
import { type TagRepresentation, type CollectionRepresentation } from "./types";
import { TagsAutocomplete } from "./TagsAutocomplete";
import { CollectionsAutocomplete } from "./CollectionsAutocomplete";
import { useSession } from "../../SessionContext";

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
        console.log({
            title: bookmarkTitle,
            url: bookmarkUrl,
            description: bookmarkDescription,
            tags: chosenTags,
            collections: chosenCollections,
        });
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
                <Button color="primary" type="submit" form="add-bookmark-form">
                    Add Bookmark
                </Button>
            </DialogActions>
        </Dialog>
    );
}
