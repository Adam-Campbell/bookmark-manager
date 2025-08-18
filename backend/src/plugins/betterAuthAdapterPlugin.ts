import fp from "fastify-plugin";
import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply,
} from "fastify";
import { auth } from "../utils/auth.ts";

/**
 * Fastify plugin to integrate BetterAuth API. Based on solution given here:
 * https://www.better-auth.com/docs/integrations/fastify
 * This is required because Better Auth expects Fetch-style requests, but Fastify uses a
 * different format.
 * @param fastify - The Fastify instance.
 * @param options - The plugin options.
 */
async function betterAuthAdapterPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.route({
        method: ["GET", "POST"],
        url: "/api/auth/*",
        async handler(request: FastifyRequest, reply: FastifyReply) {
            try {
                // Construct request URL
                const url = new URL(
                    request.url,
                    `http://${request.headers.host}`
                );

                // Convert Fastify headers to standard Headers object
                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) headers.append(key, value.toString());
                });

                // Create Fetch API-compatible request
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body
                        ? JSON.stringify(request.body)
                        : undefined,
                });

                // Process authentication request
                const response = await auth.handler(req);

                // Forward response to client
                reply.status(response.status);
                response.headers.forEach((value, key) =>
                    reply.header(key, value)
                );
                reply.send(response.body ? await response.text() : null);
            } catch (error) {
                fastify.log.error(error);
                reply.status(500).send({
                    error: "Internal authentication error",
                    code: "AUTH_FAILURE",
                });
            }
        },
    });
}

export default fp(betterAuthAdapterPlugin);
