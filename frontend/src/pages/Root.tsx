import { Outlet, useLoaderData } from "react-router";
import { authClient } from "../authClient";
import { SessionProvider } from "../SessionContext";

export default function RootLayout() {
    const sessionData = useLoaderData();
    return (
        <>
            <SessionProvider initialSessionData={sessionData}>
                <main>
                    <Outlet />
                </main>
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
