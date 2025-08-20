import { createBrowserRouter, redirect } from "react-router";
import RootLayout, { rootLoader } from "./pages/Root";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import AboutPage from "./pages/About";
import BookmarksPage from "./pages/Bookmarks";
import CollectionsPage from "./pages/Collections";
import CollectionPage from "./pages/Collection";
import { authClient } from "./authClient";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        id: "root",
        loader: rootLoader,
        children: [
            {
                index: true,
                loader: async () => {
                    // Redirect to "/about" or "/bookmarks" depending on whether user is logged in.
                    const clientResponse = await authClient.getSession();
                    const token = clientResponse.data?.session?.token;
                    if (token) {
                        return redirect("/bookmarks");
                    }
                    return redirect("/about");
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
