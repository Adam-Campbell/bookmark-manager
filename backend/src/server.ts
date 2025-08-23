import Fastify from "fastify";
import prismaPlugin from "./plugins/prismaPlugin.ts";
import authUserPlugin from "./plugins/authUserPlugin.ts";
import betterAuthAdapterPlugin from "./plugins/betterAuthAdapterPlugin.ts";
import tagRoutes from "./routes/tagRoutes.ts";
import bookmarkRoutes from "./routes/bookmarkRoutes.ts";
import collectionRoutes from "./routes/collectionRoutes.ts";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import {
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";

dotenv.config();

// Fastify's types do not yet include routerOptions (despite this being the recommended way
// to configure Fastify), so we use 'any' to bypass type checking.
const fastify = Fastify({
    logger: true,
    routerOptions: {
        ignoreTrailingSlash: true,
    },
} as any).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

if (process.env.NODE_ENV === "development") {
    console.log("Development mode: Enabling CORS for all origins");
    // Configure CORS policy
    await fastify.register(fastifyCors, {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        maxAge: 86400,
    });
}

fastify.register(prismaPlugin);
fastify.register(authUserPlugin);
fastify.register(betterAuthAdapterPlugin);
fastify.register(tagRoutes, { prefix: "/api/tags" });
fastify.register(bookmarkRoutes, { prefix: "/api/bookmarks" });
fastify.register(collectionRoutes, { prefix: "/api/collections" });

try {
    await fastify.listen({ port: 3000, host: "127.0.0.1" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
