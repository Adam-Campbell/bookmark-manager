import { createBrowserRouter } from "react-router";
import RootLayout from "./pages/Root";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import AboutPage from "./pages/About";
import BookmarksPage from "./pages/Bookmarks";
import CollectionsPage from "./pages/Collections";
import CollectionPage from "./pages/Collection";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        id: "root",
        children: [
            {
                index: true,
                loader: () => {
                    // Redirect to "/about" or "/bookmarks" depending on whether user is logged in.
                },
            },
            {
                path: "sign-up",
                Component: SignUpPage,
            },
            {
                path: "sign-in",
                Component: SignInPage,
            },
            {
                path: "about",
                Component: AboutPage,
            },
            {
                path: "bookmarks",
                Component: BookmarksPage,
            },
            {
                path: "collections",
                Component: CollectionsPage,
            },
            {
                path: "collections/:id",
                Component: CollectionPage,
            },
        ],
    },
]);
