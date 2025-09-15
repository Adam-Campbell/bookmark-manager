import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../../types/index.ts";
import { z } from "zod";
import { TagSchema, ErrorResponseSchema } from "../schemas.ts";

const routes: FastifyPluginAsync = async (fastify: FastifyZod, options) => {
    const { prisma } = fastify;

    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: z.array(TagSchema),
                    401: ErrorResponseSchema,
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
                    401: ErrorResponseSchema,
                    409: ErrorResponseSchema,
                    500: ErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { name } = request.body;
            try {
                const tag = await prisma.tag.create({
                    data: { name, userId },
                });
                reply.send(tag);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    return reply
                        .status(409)
                        .send({ error: "A tag with that name already exists" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
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
                    401: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                    409: ErrorResponseSchema,
                    500: ErrorResponseSchema,
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

            const tag = await prisma.tag.findUnique({
                where: { id },
                select: { userId: true },
            });

            if (!tag) {
                return reply.status(404).send({ error: "Tag does not exist" });
            }
            if (tag.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this tag",
                });
            }

            try {
                const updatedTag = await prisma.tag.update({
                    where: { id, userId },
                    data: { name },
                });
                reply.send(updatedTag);
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        return reply
                            .status(404)
                            .send({ error: "Tag does not exist" });
                    }
                    if (error.code === "P2002") {
                        return reply.status(409).send({
                            error: "A tag with that name already exists",
                        });
                    }
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
                    401: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                    500: ErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { id } = request.params;
            const tag = await prisma.tag.findUnique({
                where: { id },
                select: { userId: true },
            });

            if (!tag) {
                return reply.status(404).send({ error: "Tag does not exist" });
            }
            if (tag.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this tag",
                });
            }
            try {
                await prisma.tag.delete({
                    where: { id },
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
                        .send({ error: "Tag does not exist" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );
};

export default routes;
