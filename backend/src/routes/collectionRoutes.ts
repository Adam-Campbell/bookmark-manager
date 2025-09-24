import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Prisma, Collection } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../../types/index.ts";
import {
    CollectionBodySchema,
    CollectionWithBookmarkCountSchema,
    CollectionWithBookmarksSchema,
    ErrorResponseSchema,
    IntIdParams,
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
                    401: ErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const collections = await prisma.collection.findMany({
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
                params: IntIdParams,
                response: {
                    200: CollectionWithBookmarksSchema,
                    401: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
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
                    .send({ error: "Collection does not exist" });
            }
            if (collection.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this collection",
                });
            }

            const formattedCollection = {
                ...collection,
                bookmarks: collection.bookmarks.map((bic) => ({
                    ...bic.bookmark,
                    bookmarkIndex: bic.bookmarkIndex,
                })),
            };
            reply.send(formattedCollection);
        }
    );

    // Create a new collection
    fastify.post(
        "/",
        {
            schema: {
                body: CollectionBodySchema,
                response: {
                    200: CollectionWithBookmarksSchema,
                    401: ErrorResponseSchema,
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
                data: {
                    title,
                    description,
                    userId,
                },
            });
            // There are no bookmarks in a new collection, but we add the empty array to give
            // it a consistent shape.
            const formattedCollection = {
                ...collection,
                bookmarks: [],
            };
            reply.send(formattedCollection);
        }
    );

    // Update a collection (title and description)
    fastify.patch(
        "/:id",
        {
            schema: {
                params: IntIdParams,
                body: CollectionBodySchema,
                response: {
                    200: CollectionWithBookmarksSchema,
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
            const { title } = request.body;
            const description = request.body.description ?? "";

            const collection = await prisma.collection.findUnique({
                where: { id },
            });
            if (!collection) {
                return reply
                    .status(404)
                    .send({ error: "Collection does not exist" });
            }
            if (collection.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this collection",
                });
            }
            try {
                const updatedCollection = await prisma.collection.update({
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

                const formattedUpdatedCollection = {
                    ...updatedCollection,
                    bookmarks: updatedCollection.bookmarks.map((bic) => ({
                        ...bic.bookmark,
                        bookmarkIndex: bic.bookmarkIndex,
                    })),
                };

                reply.send(formattedUpdatedCollection);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply
                        .status(404)
                        .send({ error: "Collection does not exist" });
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
                params: IntIdParams,
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

            const collection = await prisma.collection.findUnique({
                where: { id },
            });
            if (!collection) {
                return reply
                    .status(404)
                    .send({ error: "Collection does not exist" });
            }
            if (collection.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this collection",
                });
            }
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
                        .send({ error: "Collection does not exist" });
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
