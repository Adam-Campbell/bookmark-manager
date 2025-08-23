import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../../types/index.ts";
import { z } from "zod";
import { TagSchema } from "../schemas.ts";

const routes: FastifyPluginAsync = async (fastify: FastifyZod, options) => {
    const { prisma } = fastify;

    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: z.array(TagSchema),
                    401: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const tags = await prisma.tag.findMany({
                where: { userId },
            });
            reply.send(tags);
        }
    );

    fastify.post(
        "/",
        {
            schema: {
                body: z.object({
                    name: z.string().min(2).max(100),
                }),
                response: {
                    200: TagSchema,
                    401: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
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
        {
            schema: {
                params: z.object({
                    id: z.coerce.number().int(),
                }),
                body: z.object({
                    name: z.string().min(2).max(100),
                }),
                response: {
                    200: TagSchema,
                    401: z.object({ error: z.string() }),
                    404: z.object({ error: z.string() }),
                    500: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { id } = request.params;
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
        {
            schema: {
                params: z.object({
                    id: z.coerce.number().int(),
                }),
                response: {
                    204: z.undefined(),
                    401: z.object({ error: z.string() }),
                    404: z.object({ error: z.string() }),
                    500: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { id } = request.params;
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
