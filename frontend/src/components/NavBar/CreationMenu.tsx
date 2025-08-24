import { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useModal } from "../../ModalContext";

export function CreationMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { openModal } = useModal();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreateBookmarkClick = () => {
        openModal("addBookmark");
        handleClose();
    };

    const handleCreateCollectionClick = () => {
        openModal("addCollection");
        handleClose();
    };

    const isOpen = Boolean(anchorEl);

    return (
        <>
            <Button
                id="creation-menu-button"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
                aria-controls={isOpen ? "creation-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? "true" : "false"}
                sx={{
                    bgcolor: "primary.dark",
                    color: "primary.contrastText",
                    mr: 1,
                }}
            >
                Create
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                id="creation-menu"
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                sx={{ mt: 1 }}
            >
                <MenuItem onClick={handleCreateBookmarkClick}>
                    New Bookmark
                </MenuItem>
                <MenuItem onClick={handleCreateCollectionClick}>
                    New Collection
                </MenuItem>
            </Menu>
        </>
    );
}
