import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/index.js";

const routes: FastifyPluginAsync = async (fastify, options) => {
    const { prisma } = fastify;

    // Get all collections for current user
    fastify.get("/", async (request: FastifyRequest, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
        const collections = await prisma.collection.findMany({
            where: { userId },
        });
        reply.send(collections);
    });

    // Get a single collection
    fastify.get(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            const collection = await prisma.collection.findUnique({
                where: { id, userId },
            });
            if (!collection) {
                return reply
                    .status(404)
                    .send({ error: "Collection not found" });
            }
            reply.send(collection);
        }
    );

    // Create a new collection
    fastify.post(
        "/",
        async (
            request: FastifyRequest<{
                Body: { title: string; description?: string };
            }>,
            reply
        ) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { title, description } = request.body;
            const collection = await prisma.collection.create({
                data: { title, description, userId },
            });
            reply.send(collection);
        }
    );

    // Update a collection (title and description)
    fastify.patch(
        "/:id",
        async (
            request: FastifyRequest<{
                Params: { id: string };
                Body: { title: string; description: string };
            }>,
            reply
        ) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            const { title, description } = request.body;
            try {
                const collection = await prisma.collection.update({
                    where: { id, userId },
                    data: { title, description },
                });
                reply.send(collection);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply
                        .status(404)
                        .send({ error: "Collection not found" });
                }
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ error: "Internal Server Error" });
            }
        }
    );

    // Delete a collection
    fastify.delete(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            try {
                const collection = await prisma.collection.delete({
                    where: { id, userId },
                });
                reply.status(204).send();
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply
                        .status(404)
                        .send({ error: "Collection not found" });
                }
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ error: "Internal Server Error" });
            }
        }
    );
};

export default routes;
