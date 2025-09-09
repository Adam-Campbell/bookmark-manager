import { createBrowserRouter, redirect } from "react-router";
import { authClient } from "./authClient";
import AboutPage from "./pages/About";
import BookmarksPage, { bookmarksLoader } from "./pages/Bookmarks";
import CollectionPage, { collectionLoader } from "./pages/Collection";
import CollectionsPage, { collectionsLoader } from "./pages/Collections";
import ErrorPage from "./pages/Error";
import RootLayout, { rootLoader } from "./pages/Root";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import UserSettingsPage, { userSettingsLoader } from "./pages/UserSettings";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        id: "root",
        loader: rootLoader,
        ErrorBoundary: ErrorPage,
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
                loader: bookmarksLoader,
            },
            {
                path: "collections",
                Component: CollectionsPage,
                loader: collectionsLoader,
            },
            {
                path: "collections/:id",
                Component: CollectionPage,
                loader: collectionLoader,
            },
            {
                path: "user-settings",
                Component: UserSettingsPage,
                loader: userSettingsLoader,
            },
        ],
    },
]);
