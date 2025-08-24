import { Outlet, useLoaderData } from "react-router";
import { authClient } from "../authClient";
import { SessionProvider } from "../SessionContext";
import NavBar from "../components/NavBar";
import MobileNav from "../components/MobileNav";
import AddBookmarkModal from "../components/AddBookmarkModal";
import AddCollectionModal from "../components/AddCollectionModal";

export default function RootLayout() {
    const sessionData = useLoaderData();
    console.log(sessionData);
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
