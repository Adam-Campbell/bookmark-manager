import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, Box, IconButton } from "@mui/material";
import { type UseMutateFunction } from "@tanstack/react-query";
import { useState } from "react";

type TagListItemEditProps = {
    name: string;
    id: number;
    onCancel: () => void;
    onConfirmCb: UseMutateFunction<
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
    const [tagName, setTagName] = useState(name);

    async function handleConfirm() {
        onConfirmCb({ id, name: tagName });
        onCancel();
    }

    return (
        <>
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
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
            />
            <Box component="span" sx={{ flexShrink: 0 }}>
                <IconButton onClick={onCancel}>
                    <CloseIcon />
                </IconButton>
                <IconButton onClick={handleConfirm}>
                    <CheckIcon />
                </IconButton>
            </Box>
        </>
    );
}
