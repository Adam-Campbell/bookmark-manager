import { useState, useEffect } from "react";
import { useModal } from "../ModalContext";
import { useSession } from "../SessionContext";
import { useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { queryClient } from "../http";

type CollectionResourceBody = {
    title: string;
    description?: string;
};

export default function AddCollectionModal() {
    const { activeModal, closeModal } = useModal();
    const { isLoggedIn } = useSession();

    const [collectionTitle, setCollectionTitle] = useState("");
    const [collectionDescription, setCollectionDescription] = useState("");

    const { mutate, isPending: submissionPending } = useMutation({
        mutationFn: async (newCollection: CollectionResourceBody) => {
            const response = await fetch("/api/collections", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCollection),
            });
            if (!response.ok) {
                throw new Error("Failed to create collection");
            }
            const collection = await response.json();
            return collection;
        },
        onSuccess: () => {
            console.log("Collection successfully created");
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            closeModal();
        },
    });

    useEffect(() => {
        if (activeModal === "addCollection") {
            setCollectionTitle("");
            setCollectionDescription("");
        }
    }, [activeModal]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const collectionData = {
            title: collectionTitle,
            description: collectionDescription,
        };
        mutate(collectionData);
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <Dialog
            open={activeModal === "addCollection"}
            onClose={closeModal}
            closeAfterTransition={false}
        >
            <DialogTitle>Add Collection</DialogTitle>
            <DialogContent>
                <form id="add-collection-form" onSubmit={handleSubmit}>
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
                <Button onClick={closeModal} color="secondary">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    form="add-collection-form"
                    disabled={submissionPending}
                >
                    {submissionPending ? (
                        <CircularProgress size={20} />
                    ) : (
                        "Add Collection"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
