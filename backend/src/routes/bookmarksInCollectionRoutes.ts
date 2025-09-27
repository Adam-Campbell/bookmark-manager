import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../types.ts";
import {
    CollectionWithBookmarksSchema,
    ErrorResponseSchema,
    IntId,
} from "../schemas.ts";

/*
    All routes within this plugin have access to a collectionId param on the request.params
    object, which comes from the prefix applied when registering the plugin within
    collectionRoutes.ts.

    The full prefix is:
    /api/collections/:collectionId/bookmarks
*/

const routes: FastifyPluginAsync = async (fastify: FastifyZod, options) => {
    const { prisma } = fastify;

    // Legacy method, not actively used by frontend anymore, will remove eventually.
    fastify.put(
        "/",
        {
            schema: {
                params: z.object({
                    collectionId: IntId,
                }),
                body: z.object({
                    bookmarkIds: z.array(IntId),
                }),
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
            const { collectionId } = request.params;
            const { bookmarkIds } = request.body;

            const collection = await prisma.collection.findUnique({
                where: {
                    id: collectionId,
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

            // Get all bookmarks that have ids included in bookmarkIds
            const matchingBookmarks = await prisma.bookmark.findMany({
                where: {
                    id: { in: bookmarkIds },
                    userId,
                },
                select: { id: true },
            });

            // Filter bookmarkIds down to just those ids for which a bookmark does
            // exist (belonging to the current user). Of the ids that remain, relative
            // order stays the same.
            const validBookmarkIds = bookmarkIds.filter((bookmarkId) =>
                matchingBookmarks.some((bookmark) => bookmark.id === bookmarkId)
            );

            try {
                await prisma.$transaction([
                    prisma.bookmarksInCollections.deleteMany({
                        where: { collectionId },
                    }),
                    prisma.bookmarksInCollections.createMany({
                        data: validBookmarkIds.map((bookmarkId, index) => ({
                            collectionId,
                            bookmarkId,
                            bookmarkIndex: index,
                        })),
                    }),
                ]);

                const collection = await prisma.collection.findUnique({
                    where: {
                        id: collectionId,
                        userId,
                    },
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
                const formattedCollection = {
                    ...collection,
                    bookmarks: collection.bookmarks.map((bic) => ({
                        ...bic.bookmark,
                        bookmarkIndex: bic.bookmarkIndex,
                    })),
                };
                reply.send(formattedCollection);
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ error: "Internal Server Error" });
            }
        }
    );

    fastify.post(
        "/",
        {
            schema: {
                params: z.object({
                    collectionId: IntId,
                }),
                body: z.object({
                    bookmarkIds: z.array(IntId),
                }),
                response: {
                    204: z.undefined(),
                    400: ErrorResponseSchema,
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

            const { collectionId } = request.params;
            const { bookmarkIds } = request.body;

            if (bookmarkIds.length === 0) {
                return reply
                    .status(400)
                    .send({ error: "bookmarkIds array must not be empty" });
            }

            const collection = await prisma.collection.findUnique({
                where: { id: collectionId },
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

            const existingInclusions =
                await prisma.bookmarksInCollections.findMany({
                    where: { collectionId },
                    select: { bookmarkId: true, bookmarkIndex: true },
                });

            const existingIds = new Set(
                existingInclusions.map((i) => i.bookmarkId)
            );

            const bookmarks = await prisma.bookmark.findMany({
                where: { id: { in: bookmarkIds } },
                select: { id: true, userId: true },
            });

            if (bookmarks.length < bookmarkIds.length) {
                return reply
                    .status(404)
                    .send({ error: "One or more bookmarks do not exist" });
            }

            for (const bookmark of bookmarks) {
                if (bookmark.userId !== userId) {
                    return reply.status(403).send({
                        error: "You do not have permission to access one or more bookmarks",
                    });
                }
                if (existingIds.has(bookmark.id)) {
                    return reply.status(409).send({
                        error: "One or more bookmarks are already in the collection",
                    });
                }
            }

            const startIndex = existingInclusions.length;

            try {
                await prisma.bookmarksInCollections.createMany({
                    data: bookmarks.map((bookmark, index) => ({
                        collectionId,
                        bookmarkId: bookmark.id,
                        bookmarkIndex: startIndex + index,
                    })),
                });
                return reply.status(204).send();
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ error: "Internal Server Error" });
            }
        }
    );

    fastify.delete(
        "/:bookmarkId",
        {
            schema: {
                params: z.object({
                    collectionId: IntId,
                    bookmarkId: IntId,
                }),
                response: {
                    204: z.undefined(),
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

            const { collectionId, bookmarkId } = request.params;

            const collection = await prisma.collection.findUnique({
                where: { id: collectionId },
                select: { userId: true },
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

            const bookmark = await prisma.bookmark.findUnique({
                where: { id: bookmarkId },
                select: { userId: true },
            });
            if (!bookmark) {
                return reply
                    .status(404)
                    .send({ error: "Bookmark does not exist" });
            }
            if (bookmark.userId !== userId) {
                return reply.status(403).send({
                    error: "You do not have permission to access this bookmark",
                });
            }
            const currentBookmarkInCollection =
                await prisma.bookmarksInCollections.findUnique({
                    where: {
                        bookmarkId_collectionId: {
                            bookmarkId,
                            collectionId,
                        },
                    },
                    select: { id: true, bookmarkIndex: true },
                });
            if (!currentBookmarkInCollection) {
                return reply
                    .status(409)
                    .send({ error: "Bookmark is not in collection" });
            }

            try {
                await prisma.$transaction(async (tx) => {
                    const toBeDeletedId = currentBookmarkInCollection.id;
                    const toBeDeletedBookmarkIndex =
                        currentBookmarkInCollection.bookmarkIndex;
                    await tx.bookmarksInCollections.delete({
                        where: { id: toBeDeletedId },
                    });
                    await tx.bookmarksInCollections.updateMany({
                        where: {
                            collectionId,
                            bookmarkIndex: { gt: toBeDeletedBookmarkIndex },
                        },
                        data: { bookmarkIndex: { decrement: 1 } },
                    });
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
                        .send({ error: "Bookmark does not exist" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );

    fastify.patch(
        "/",
        {
            schema: {
                params: z.object({
                    collectionId: IntId,
                }),
                body: z.object({
                    currentIndex: z.coerce.number().int().nonnegative(),
                    newIndex: z.coerce.number().int().nonnegative(),
                }),
                response: {
                    204: z.undefined(),
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
            const { collectionId } = request.params;
            const { currentIndex, newIndex } = request.body;

            const collection = await prisma.collection.findUnique({
                where: { id: collectionId },
                include: {
                    _count: {
                        select: {
                            bookmarks: true,
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

            const maxIndex = collection._count.bookmarks - 1;

            if (currentIndex > maxIndex || newIndex > maxIndex) {
                return reply.status(409).send({
                    error: "One or both of the given indexes are out of range",
                });
            }

            const currentBic = await prisma.bookmarksInCollections.findFirst({
                where: {
                    collectionId,
                    bookmarkIndex: currentIndex,
                },
                select: {
                    id: true,
                },
            });
            if (!currentBic) {
                return reply
                    .status(500)
                    .send({ error: "Internal server error" });
            }
            // Grab the id of the bookmarksInCollection row that currently has currentIndex as
            // its bookmarkIndex
            const currentBicId = currentBic.id;

            try {
                await prisma.$transaction(async (tx) => {
                    if (newIndex < currentIndex) {
                        await tx.bookmarksInCollections.updateMany({
                            where: {
                                collectionId,
                                bookmarkIndex: {
                                    gte: newIndex,
                                    lt: currentIndex,
                                },
                            },
                            data: {
                                bookmarkIndex: { increment: 1 },
                            },
                        });
                    } else if (newIndex > currentIndex) {
                        await tx.bookmarksInCollections.updateMany({
                            where: {
                                collectionId,
                                bookmarkIndex: {
                                    gt: currentIndex,
                                    lte: newIndex,
                                },
                            },
                            data: {
                                bookmarkIndex: { decrement: 1 },
                            },
                        });
                    }
                    await tx.bookmarksInCollections.update({
                        where: { id: currentBicId },
                        data: { bookmarkIndex: newIndex },
                    });
                });
                return reply.status(204).send();
            } catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );
};

export default routes;
