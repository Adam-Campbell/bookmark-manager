import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/index.js";

const routes: FastifyPluginAsync = async (fastify, options) => {
    const { prisma } = fastify;

    fastify.get("/", async (request: FastifyRequest, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
        const tags = await prisma.tag.findMany({
            where: { userId },
        });
        reply.send(tags);
    });

    fastify.post(
        "/",
        async (request: FastifyRequest<{ Body: { name: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { name } = request.body;
            const tag = await prisma.tag.create({
                data: { name, userId },
            });
            reply.send(tag);
        }
    );

    fastify.patch(
        "/:id",
        async (
            request: FastifyRequest<{
                Params: { id: string };
                Body: { name: string };
            }>,
            reply
        ) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            const { name } = request.body;
            try {
                const tag = await prisma.tag.update({
                    where: { id, userId },
                    data: { name },
                });
                reply.send(tag);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply.status(404).send({ error: "Tag not found" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );

    fastify.delete(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            try {
                await prisma.tag.deleteMany({
                    where: { id, userId },
                });
                reply.status(204).send();
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply.status(404).send({ error: "Tag not found" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );
};

export default routes;
