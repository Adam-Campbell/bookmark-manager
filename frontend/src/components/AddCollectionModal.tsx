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
import { queryClient } from "../http";
import { useModal } from "../ModalContext";
import { useSession } from "../SessionContext";
import { showErrorSnackbar, showSuccessSnackbar } from "../snackbarStore";
import FormTextField from "./FormTextField";

const AddCollectionSchema = z.object({
    title: z
        .string()
        .min(1, "Please provide a collection title")
        .max(150, "Collection title cannot exceed 150 characters"),
    description: z
        .string()
        .min(1, "Please provide a collection description")
        .max(500, "Collection description cannot exceed 500 characters"),
});

type CollectionResourceBody = {
    title: string;
    description?: string;
};

export default function AddCollectionModal() {
    const { activeModal, closeModal } = useModal();
    const { isLoggedIn } = useSession();

    const { mutate: addCollectionMutation, isPending: submissionPending } =
        useMutation({
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
                queryClient.invalidateQueries({ queryKey: ["collections"] });
                closeModal();
                showSuccessSnackbar("Collection created");
            },
            onError: () => {
                showErrorSnackbar("Failed to create collection");
            },
        });

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
        },
        validators: {
            onChange: AddCollectionSchema,
        },
        onSubmit: async ({ value }) => {
            const { title, description } = value;
            addCollectionMutation({ title, description });
        },
    });

    useEffect(() => {
        if (activeModal === "addCollection") {
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
            open={activeModal === "addCollection"}
            onClose={closeModal}
            closeAfterTransition={false}
        >
            <DialogTitle>Add Collection</DialogTitle>
            <DialogContent>
                <form id="add-collection-form" onSubmit={handleSubmit}>
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
