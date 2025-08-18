import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { auth } from "../utils/auth.ts";

/**
 * Authenticates the user using the BetterAuth API, attaching a user object to
 * the request if a valid session exists.
 * @param fastify - The Fastify instance.
 * @param options - The plugin options.
 */
async function authUserPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.decorateRequest("user", undefined);

    fastify.addHook("preHandler", async (request, reply) => {
        // Extract headers from the request
        const fetchHeaders = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
            if (typeof value === "string") {
                fetchHeaders.append(key, value);
            } else if (Array.isArray(value)) {
                for (const v of value) fetchHeaders.append(key, v);
            }
        }
        // Pass to Better Auth to determine if there is a session
        const session = await auth.api.getSession({
            headers: fetchHeaders,
        });
        // If a session exists, attach the users id to the request
        if (session?.user) {
            request.user = {
                id: session.user.id,
            };
        }
    });
}

export default fp(authUserPlugin);
