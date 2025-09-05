import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
    TextField,
    Box,
    IconButton,
    Button,
    Typography,
    Stack,
    Divider,
} from "@mui/material";
import { useState } from "react";

type InlineEditRowProps = {
    currentValue: string;
    label: string;
    title: string;
    id: string;
    onConfirm: (newValue: string) => Promise<void>;
    pushDown?: boolean;
};

export function InlineEditRow({
    currentValue,
    label,
    title,
    id,
    onConfirm,
    pushDown,
}: InlineEditRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(currentValue);

    function handleEnterUpdateMode() {
        setNewValue(currentValue);
        setIsEditing(true);
    }

    function handleUpdateCancel() {
        setIsEditing(false);
        setNewValue("");
    }

    async function handleUpdateConfirm() {
        await onConfirm(newValue);
        setIsEditing(false);
        setNewValue("");
    }

    let internalContent;
    if (isEditing) {
        internalContent = (
            <>
                <TextField
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    variant="outlined"
                    size="small"
                    id={id}
                    autoFocus
                    slotProps={{
                        htmlInput: {
                            "aria-label": label,
                        },
                    }}
                />
                <Box component="span" sx={{ flexShrink: 0 }}>
                    <IconButton onClick={handleUpdateCancel}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={handleUpdateConfirm}>
                        <CheckIcon />
                    </IconButton>
                </Box>
            </>
        );
    } else {
        internalContent = (
            <>
                <Typography
                    variant="body1"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whitespace: "nowrap",
                    }}
                >
                    {currentValue}
                </Typography>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleEnterUpdateMode}
                >
                    Update
                </Button>
            </>
        );
    }

    return (
        <>
            <Typography variant="subtitle1" component="p" mt={pushDown ? 3 : 0}>
                {title}
            </Typography>
            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "40px",
                    mb: 1,
                }}
            >
                {internalContent}
            </Stack>
            <Divider />
        </>
    );
}
