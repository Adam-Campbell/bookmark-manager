import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <>
            <h1>This is the root layout</h1>
            <main>
                <Outlet />
            </main>
        </>
    );
}
