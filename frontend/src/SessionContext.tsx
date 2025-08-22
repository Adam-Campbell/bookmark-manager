import { createContext, useContext, useState, type ReactNode } from "react";
import { authClient } from "./authClient";
import { useNavigate } from "react-router";

type UserData = {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null | undefined;
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

type SessionData = {
    token: string | null;
    user: UserData | null;
};

type SessionContextValue = {
    token: string | null;
    user: UserData | null;
    isLoggedIn: Boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
    undefined
);

export const SessionProvider = ({
    children,
    initialSessionData = { token: null, user: null },
}: {
    children: ReactNode;
    initialSessionData?: SessionData;
}) => {
    const navigate = useNavigate();
    const [data, setData] = useState(initialSessionData);

    const signUp = async (email: string, password: string, name: string) => {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        if (error) {
            console.warn(error);
            return;
        }
        setData({
            token: data.token,
            user: data.user,
        });
        navigate("/bookmarks");
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });
        if (error) {
            console.warn(error);
            return;
        }
        setData({
            token: data.token,
            user: data.user,
        });
        navigate("/bookmarks");
    };

    const signOut = async () => {
        const signOutResponse = await authClient.signOut();
        if (signOutResponse.error) {
            console.warn(signOutResponse.error);
            return;
        }
        setData({ token: null, user: null });
        navigate("/sign-in");
    };

    return (
        <SessionContext.Provider
            value={{
                token: data.token,
                user: data.user,
                isLoggedIn: Boolean(data.token),
                signUp,
                signIn,
                signOut,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const ctx = useContext(SessionContext);
    if (!ctx)
        throw new Error("useSession must be used within a SessionProvider");
    return ctx;
};
