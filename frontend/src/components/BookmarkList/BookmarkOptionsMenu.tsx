import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function BookmarkOptionsMenu({
    bookmarkId,
    beginDeletion,
}: {
    bookmarkId: number;
    beginDeletion: (id: number) => void;
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        beginDeletion(bookmarkId);
        handleMenuClose();
    };

    const optionsMenuIsOpen = Boolean(anchorEl);

    return (
        <>
            <IconButton
                size="small"
                id={`options-button-${bookmarkId}`}
                onClick={handleMenuAnchorClick}
                aria-controls={
                    optionsMenuIsOpen ? `options-menu-${bookmarkId}` : undefined
                }
                aria-haspopup="true"
                aria-expanded={optionsMenuIsOpen ? "true" : "false"}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id={`options-menu-${bookmarkId}`}
                anchorEl={anchorEl}
                open={optionsMenuIsOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
            >
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
        </>
    );
}
