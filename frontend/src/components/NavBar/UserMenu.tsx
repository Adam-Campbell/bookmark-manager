import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { useSession } from "../../SessionContext";

export function UserMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { signOut, user } = useSession();

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

    const userInitials = user
        ? user.name
              .split(" ")
              .map((name) => name[0])
              .join("")
        : "";

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
                    {userInitials}
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
                <MenuItem
                    component={RouterLink}
                    to="/user-settings"
                    onClick={handleClose}
                >
                    User Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
        </>
    );
}
