import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prismaClient.ts";

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
    emailAndPassword: {
        enabled: true,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
        updateAge: 60 * 60 * 24,
        expiresIn: 60 * 60 * 24 * 28,
    },
    user: {
        changeEmail: {
            enabled: true,
        },
        deleteUser: {
            enabled: true,
        },
    },
});
