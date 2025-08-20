import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
} from "@mui/material";
import { useBookmarkModal } from "../BookmarkModalContext";

const tagsData = [
    "abstract-algebra",
    "action",
    "adventure",
    "art",
    "backend",
    "book-review",
    "booktalk",
    "css",
    "database",
    "design",
    "design-patterns",
    "development",
    "devops",
    "digitalocean",
    "discussion",
    "dnd",
    "embedded",
    "fantasy",
    "fastify",
    "frontend",
    "grid",
    "history",
    "hosting",
    "indexeddb",
    "inspiration",
    "javascript",
    "layout",
    "let's-play",
    "mathematics",
    "military",
    "nodejs",
    "orm",
    "politics",
    "prisma",
    "programming",
    "react",
    "rpg",
    "screenwriting",
    "set-theory",
    "sqlite",
    "storage",
    "storytelling",
    "strategy",
    "tabletop",
    "theoretical-computer-science",
    "topology",
    "typescript",
    "webdev",
    "writing-inspiration",
    "writing",
    "youtube",
];

const collectionsData = [
    "Bookmarks",
    "Reading List",
    "Favorites",
    "To Read",
    "Inspiration",
    "Ideas",
    "Projects",
    "Work",
    "Personal",
    "Archived",
    "React tutorials",
    "Web Development",
    "Math",
    "Let's Plays",
];

export default function AddBookmarkModal() {
    const { isOpen, closeModal } = useBookmarkModal();
    const [bookmarkTitle, setBookmarkTitle] = useState("");
    const [bookmarkUrl, setBookmarkUrl] = useState("");
    const [bookmarkDescription, setBookmarkDescription] = useState("");
    const [chosenTags, setChosenTags] = useState<string[]>([]);
    const [chosenCollections, setChosenCollections] = useState<string[]>([]);

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
                    <Autocomplete
                        multiple
                        freeSolo
                        options={tagsData}
                        value={chosenTags}
                        sx={{ mb: 2 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                label="Add Tags"
                                placeholder="Add Tags"
                            />
                        )}
                        onChange={(_event, value, _reason, _details) => {
                            setChosenTags(value);
                        }}
                    />
                    <Autocomplete
                        multiple
                        options={collectionsData}
                        value={chosenCollections}
                        sx={{ mb: 2 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                label="Add to Collection"
                                placeholder="Add to Collection"
                            />
                        )}
                        onChange={(_event, value, _reason, _details) => {
                            setChosenCollections(value);
                        }}
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
