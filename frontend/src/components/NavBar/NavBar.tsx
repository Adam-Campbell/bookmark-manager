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
import { useSession } from "../../SessionContext";

export default function NavBar() {
    const isTabletUp = useMediaQuery("(min-width:768px)");
    const { isLoggedIn } = useSession();

    const AuthenticatedLinks = () => (
        <>
            {isTabletUp && (
                <>
                    <NavLink to="/bookmarks">Bookmarks</NavLink>
                    <NavLink to="/collections">Collections</NavLink>
                    <CreationMenu />
                </>
            )}
            <UserMenu />
        </>
    );

    const UnauthenticatedLinks = () => (
        <>
            <NavLink to="/sign-in">Sign In</NavLink>
        </>
    );

    return (
        <Box position="sticky" top="10px" sx={{ width: "100%", zIndex: 1200 }}>
            <Container maxWidth="lg">
                <AppBar
                    position="static"
                    sx={{
                        borderRadius: 2,
                        bgcolor: (theme) => theme.palette.primary.main,
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Bookmarkly
                        </Typography>
                        {isLoggedIn ? (
                            <AuthenticatedLinks />
                        ) : (
                            <UnauthenticatedLinks />
                        )}
                    </Toolbar>
                </AppBar>
            </Container>
        </Box>
    );
}
