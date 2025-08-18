import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import prisma from "../prismaClient.ts";

/**
 * Adds Prisma client to the Fastify context.
 * @param fastify  Fastify instance
 * @param options  Fastify plugin options
 */
async function prismaPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    // Add prisma instance to fastify instance
    fastify.decorate("prisma", prisma);

    // Ensure that we disconnect from the database on app shutdown or restart.
    fastify.addHook("onClose", async (instance: FastifyInstance) => {
        await prisma.$disconnect();
    });
}

export default fp(prismaPlugin);
