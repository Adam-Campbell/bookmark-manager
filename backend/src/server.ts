import Fastify from "fastify";
import prismaPlugin from "./plugins/prismaPlugin.ts";
import authUserPlugin from "./plugins/authUserPlugin.ts";
import betterAuthAdapterPlugin from "./plugins/betterAuthAdapterPlugin.ts";

const fastify = Fastify({
    logger: true,
});

fastify.register(prismaPlugin);
fastify.register(authUserPlugin);
fastify.register(betterAuthAdapterPlugin);

try {
    await fastify.listen({ port: 3000, host: "127.0.0.1" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
