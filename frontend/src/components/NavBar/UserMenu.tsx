import { useState } from "react";
import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useSession } from "../../SessionContext";

export function UserMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { signOut } = useSession();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut();
        handleClose();
    };

    const isOpen = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={handleOpen}
                aria-controls={isOpen ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? "true" : "false"}
            >
                <Avatar
                    sx={{
                        bgcolor: "background.default",
                        color: "text.primary",
                    }}
                >
                    AC
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                id="user-menu"
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
            >
                <MenuItem onClick={handleClose}>View Profile</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
        </>
    );
}
