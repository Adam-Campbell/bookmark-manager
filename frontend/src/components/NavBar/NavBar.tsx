import { Box, Container, AppBar, Toolbar, useMediaQuery } from "@mui/material";
import { useSession } from "../../SessionContext";
import { CreationMenu } from "./CreationMenu";
import { NavLink } from "./NavLink";
import { NavLogo } from "./NavLogo";
import { UserMenu } from "./UserMenu";

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
                        <NavLogo />
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
