import { useState } from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Box,
    Paper,
    useMediaQuery,
    Menu,
    MenuItem,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AddIcon from "@mui/icons-material/Add";
import { Link as NavLink } from "react-router";
import { useBookmarkModal } from "../BookmarkModalContext";
import { useSession } from "../SessionContext";

// There isn't currently much use for this component since I'm not doing anything conditionally
// based on whether it matches the route, but I'm leaving it in place in case I want to
// add that later.
function MobileNavLink({
    label,
    icon,
    to,
}: {
    label: string;
    icon: React.ReactNode;
    to: string;
}) {
    return (
        <BottomNavigationAction
            label={label}
            icon={icon}
            component={NavLink}
            to={to}
            showLabel={true}
            sx={{
                color: "primary.contrastText",
            }}
        />
    );
}

export default function MobileNav() {
    const isTabletUp = useMediaQuery("(min-width:768px)");
    const { isLoggedIn } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { openModal } = useBookmarkModal();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateBookmarkClick = () => {
        openModal();
        handleMenuClose();
    };

    const isOpen = Boolean(anchorEl);

    if (isTabletUp || !isLoggedIn) {
        return null; // Don't render on tablet or larger screens, or if not logged in
    }
    return (
        <Box position="fixed" sx={{ bottom: 10, left: 0, right: 0 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ borderRadius: 2 }}>
                    <BottomNavigation
                        showLabels
                        sx={{ bgcolor: "primary.main", borderRadius: 2 }}
                    >
                        <MobileNavLink
                            label="Bookmarks"
                            icon={<BookmarkIcon />}
                            to="/bookmarks"
                        />
                        <BottomNavigationAction
                            icon={<AddIcon />}
                            label="Create"
                            showLabel={true}
                            sx={{
                                color: "primary.contrastText",
                            }}
                            onClick={handleMenuOpen}
                            aria-controls={
                                isOpen ? "bottom-nav-creation-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={isOpen ? "true" : "false"}
                        />
                        <MobileNavLink
                            label="Collections"
                            icon={<CollectionsBookmarkIcon />}
                            to="/collections"
                        />
                    </BottomNavigation>
                    <Menu
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={handleMenuClose}
                        id="bottom-nav-creation-menu"
                        anchorOrigin={{ horizontal: "center", vertical: "top" }}
                        transformOrigin={{
                            horizontal: "center",
                            vertical: "bottom",
                        }}
                    >
                        <MenuItem onClick={handleCreateBookmarkClick}>
                            New Bookmark
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            New Collection
                        </MenuItem>
                    </Menu>
                </Paper>
            </Container>
        </Box>
    );
}
