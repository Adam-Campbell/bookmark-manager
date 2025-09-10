import { ListItem } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../../http";
import { showErrorSnackbar, showSuccessSnackbar } from "../../snackbarStore";
import { type Tag } from "../../types";
import { TagListItemDisplay } from "./TagListItemDisplay";
import { TagListItemEdit } from "./TagListItemEdit";

type TagListItemProps = {
    name: string;
    id: number;
    includeBorder?: boolean;
};

export function TagListItem({ name, id, includeBorder }: TagListItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { mutate: deleteMutation } = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/tags/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete tag");
            }
        },
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["tags"] });
            const previousTags: Tag[] | undefined = queryClient.getQueryData([
                "tags",
            ]);
            queryClient.setQueryData(
                ["tags"],
                previousTags?.filter((tag) => tag.id !== id)
            );
            return { previousTags };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(["tags"], context?.previousTags);
            showErrorSnackbar("Failed to delete tag");
        },
        onSuccess: () => {
            showSuccessSnackbar("Tag deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });

    const { mutate: editMutation, variables: editVariables } = useMutation({
        mutationFn: async ({ id, name }: { id: number; name: string }) => {
            const response = await fetch(`/api/tags/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error("Failed to update tag");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            showSuccessSnackbar("Tag updated");
        },
        onError: () => {
            showErrorSnackbar("Failed to update tag");
        },
    });

    const nameToDisplay = editVariables?.name ?? name;

    return (
        <ListItem
            disableGutters
            sx={{
                minHeight: "60px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: (theme) =>
                    includeBorder
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
            }}
        >
            {isEditing ? (
                <TagListItemEdit
                    name={name}
                    id={id}
                    onCancel={() => setIsEditing(false)}
                    onConfirmCb={editMutation}
                />
            ) : (
                <TagListItemDisplay
                    name={nameToDisplay}
                    onDelete={() => deleteMutation(id)}
                    onEditClick={() => setIsEditing(true)}
                />
            )}
        </ListItem>
    );
}
