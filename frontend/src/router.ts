import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";
import { authClient } from "./authClient";
import ErrorPage from "./pages/Error";
import RootLayout, { rootLoader } from "./pages/Root";

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
                Component: lazy(() => import("./pages/SignUp")),
            },
            {
                path: "sign-in",
                Component: lazy(() => import("./pages/SignIn")),
            },
            {
                path: "about",
                Component: lazy(() => import("./pages/About")),
            },
            {
                path: "bookmarks",
                Component: lazy(() => import("./pages/Bookmarks")),
                loader: () =>
                    import("./pages/Bookmarks").then((module) =>
                        module.bookmarksLoader()
                    ),
            },
            {
                path: "collections",
                Component: lazy(() => import("./pages/Collections")),
                loader: () =>
                    import("./pages/Collections").then((module) =>
                        module.collectionsLoader()
                    ),
            },
            {
                path: "collections/:id",
                Component: lazy(() => import("./pages/Collection")),
                loader: (args) =>
                    import("./pages/Collection").then((module) =>
                        module.collectionLoader(args)
                    ),
            },
            {
                path: "user-settings",
                Component: lazy(() => import("./pages/UserSettings")),
                loader: () =>
                    import("./pages/UserSettings").then((module) =>
                        module.userSettingsLoader()
                    ),
            },
        ],
    },
]);
