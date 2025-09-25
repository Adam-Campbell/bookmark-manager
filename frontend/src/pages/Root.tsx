import { Outlet, useLoaderData } from "react-router";
import { authClient } from "../authClient";
import { SessionProvider } from "../SessionContext";
import NavBar from "../components/NavBar";
import MobileNav from "../components/MobileNav";
import AddBookmarkModal from "../components/AddBookmarkModal";
import AddCollectionModal from "../components/AddCollectionModal";
import GlobalSnackbar from "../components/GlobalSnackbar";

export default function RootLayout() {
    const sessionData = useLoaderData();

    return (
        <>
            <SessionProvider initialSessionData={sessionData}>
                <NavBar />
                <main>
                    <Outlet />
                </main>
                <MobileNav />
                <AddBookmarkModal />
                <AddCollectionModal />
                <GlobalSnackbar />
            </SessionProvider>
        </>
    );
}

export const rootLoader = async () => {
    const clientResponse = await authClient.getSession();
    return {
        token: clientResponse.data?.session?.token || null,
        user: clientResponse.data?.user || null,
    };
};
