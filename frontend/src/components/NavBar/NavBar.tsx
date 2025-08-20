import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import { CreationMenu } from "./CreationMenu";

export default function NavBar() {
    const isTabletUp = useMediaQuery("(min-width:768px)");

    return (
        <Box position="sticky" top="10px" sx={{ width: "100%", zIndex: 1200 }}>
            <Container maxWidth="lg">
                <AppBar position="static" sx={{ borderRadius: 2 }}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Bookmarkly
                        </Typography>
                        {isTabletUp && (
                            <>
                                <NavLink to="/bookmarks">Bookmarks</NavLink>
                                <NavLink to="/collections">Collections</NavLink>
                                <CreationMenu />
                            </>
                        )}
                        <UserMenu />
                    </Toolbar>
                </AppBar>
            </Container>
        </Box>
    );
}
