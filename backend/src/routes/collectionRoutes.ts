import { FastifyPluginAsync } from "fastify";
import { Prisma, Bookmark, Collection } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../../types/index.ts";
import { z } from "zod";
import {
    CollectionWithBookmarkCountSchema,
    CollectionWithBookmarksSchema,
} from "../schemas.ts";
import bookmarksInCollectionRoutes from "./bookmarksInCollectionRoutes.ts";

const routes: FastifyPluginAsync = async (fastify: FastifyZod, options) => {
    const { prisma } = fastify;

    // Get all collections for current user
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: z.array(CollectionWithBookmarkCountSchema),
                    401: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            type CollectionWithCount = Prisma.CollectionGetPayload<{
                include: {
                    _count: {
                        select: {
                            bookmarks: true;
                        };
                    };
                };
            }>;
            const collections: CollectionWithCount[] =
                await prisma.collection.findMany({
                    where: { userId },
                    include: {
                        _count: {
                            select: {
                                bookmarks: true,
                            },
                        },
                    },
                });
            type CollectionWithBookmarkCount = Collection & {
                bookmarkCount: number;
            };
            const formattedCollections: CollectionWithBookmarkCount[] =
                collections.map(({ _count, ...rest }) => {
                    const formatted = {
                        ...rest,
                        bookmarkCount: _count.bookmarks,
                    };
                    return formatted;
                });

            reply.send(formattedCollections);
        }
    );

    // Get a single collection
    fastify.get(
        "/:id",
        {
            schema: {
                params: z.object({
                    id: z.coerce.number().int(),
                }),
                response: {
                    200: CollectionWithBookmarksSchema,
                    401: z.object({ error: z.string() }),
                    403: z.object({ error: z.string() }),
                    404: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { id } = request.params;
            const collection = await prisma.collection.findUnique({
                where: { id },
                include: {
                    bookmarks: {
                        orderBy: { bookmarkIndex: "asc" },
                        select: {
                            bookmarkIndex: true,
                            bookmark: {
                                include: { tags: true },
                            },
                        },
                    },
                },
            });
            if (!collection) {
                return reply
                    .status(404)
                    .send({ error: "Collection not found" });
            }
            if (collection.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this collection",
                });
            }
            collection.bookmarks = collection.bookmarks.map(
                (bic: { bookmarkIndex: number; bookmark: Bookmark }) => ({
                    ...bic.bookmark,
                    bookmarkIndex: bic.bookmarkIndex,
                })
            );
            reply.send(collection);
        }
    );

    // Create a new collection
    fastify.post(
        "/",
        {
            schema: {
                body: z.object({
                    title: z.string(),
                    description: z.string().optional(),
                }),
                response: {
                    200: CollectionWithBookmarksSchema,
                    401: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { title, description } = request.body;
            const collection = await prisma.collection.create({
                data: { title, description, userId },
            });
            // There are no bookmarks in a new collection, but we add the empty array to give
            // it a consistent shape.
            collection.bookmarks = [];
            reply.send(collection);
        }
    );

    // Update a collection (title and description)
    fastify.patch(
        "/:id",
        {
            schema: {
                params: z.object({
                    id: z.coerce.number().int(),
                }),
                body: z.object({
                    title: z.string(),
                    description: z.string().optional(),
                }),
                response: {
                    200: CollectionWithBookmarksSchema,
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
            const { title } = request.body;
            const description = request.body.description || "";
            try {
                const collection = await prisma.collection.update({
                    where: { id, userId },
                    data: { title, description },
                    include: {
                        bookmarks: {
                            orderBy: { bookmarkIndex: "asc" },
                            select: {
                                bookmarkIndex: true,
                                bookmark: {
                                    include: { tags: true },
                                },
                            },
                        },
                    },
                });
                collection.bookmarks = collection.bookmarks.map(
                    (bic: { bookmarkIndex: number; bookmark: Bookmark }) => ({
                        ...bic.bookmark,
                        bookmarkIndex: bic.bookmarkIndex,
                    })
                );
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
                await prisma.collection.delete({
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

    fastify.register(bookmarksInCollectionRoutes, {
        prefix: "/:collectionId/bookmarks",
    });
};

export default routes;
