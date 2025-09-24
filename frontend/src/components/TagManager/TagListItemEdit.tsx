import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, Box, IconButton } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { type UseMutateAsyncFunction } from "@tanstack/react-query";
import { z } from "zod";
import { fieldHasErrors, getFieldErrors } from "../../utils";

type TagListItemEditProps = {
    name: string;
    id: number;
    onCancel: () => void;
    onConfirmCb: UseMutateAsyncFunction<
        void,
        Error,
        { id: number; name: string },
        unknown
    >;
};

export function TagListItemEdit({
    name,
    id,
    onCancel,
    onConfirmCb,
}: TagListItemEditProps) {
    const form = useForm({
        defaultValues: {
            tagName: name,
        },
        validators: {
            onChange: z.object({
                tagName: z
                    .string()
                    .min(1, "Please provide a tag")
                    .max(60, "Tag cannot exceed 60 characters"),
            }),
        },
        onSubmit: async ({ value }) => {
            const { tagName } = value;
            await onConfirmCb({ id, name: tagName });
            onCancel();
        },
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
                onSubmit={handleSubmit}
            >
                <form.Field
                    name="tagName"
                    children={(field) => (
                        <TextField
                            variant="outlined"
                            size="small"
                            id={`edit-tag-${id}`}
                            autoFocus
                            slotProps={{
                                htmlInput: {
                                    "aria-label": "Update tag",
                                },
                            }}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            error={fieldHasErrors(field)}
                            helperText={getFieldErrors(field)}
                        />
                    )}
                />

                <Box component="span" sx={{ flexShrink: 0 }}>
                    <IconButton onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                    <form.Subscribe
                        selector={(state) => state.isSubmitting}
                        children={(isSubmitting) => (
                            <IconButton type="submit" disabled={isSubmitting}>
                                <CheckIcon />
                            </IconButton>
                        )}
                    />
                </Box>
            </Box>
        </>
    );
}
