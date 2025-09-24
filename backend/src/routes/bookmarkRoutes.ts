import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Prisma, PrismaClient } from "../../generated/prisma/index.js";
import { type FastifyZod } from "../../types/index.ts";
import {
    BookmarkBodySchema,
    BookmarkSchema,
    BookmarkWithCollectionsSchema,
    ErrorResponseSchema,
    IntIdParams,
} from "../schemas.ts";

type TagData = {
    id: number | null;
    name: string;
};

type TransactionClient = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

/**
 * Takes in a potentially mixed list of pre-existing and new tags, handles tag creation for any new
 * tags, and returns a uniform list of tag IDs.
 * @param tagsData - the list of new and existing tags
 * @param userId - the ID of the user creating the tags
 * @param prismaInstance - the Prisma client instance
 * @returns a promise that resolves to a list of tag IDs
 */
async function createAndFormatTags(
    tagsData: TagData[],
    userId: string,
    prismaInstance: TransactionClient
): Promise<{ id: number }[]> {
    // Sort tags into existing (has an id) and new (id is null)
    const existingTagIds: number[] = tagsData
        .filter((tag) => tag.id !== null)
        .map((tag) => tag.id as number);
    const newTagNames = tagsData
        .filter((tag) => tag.id === null)
        .map((tag) => tag.name);

    // Create new tags in the database
    const createdTagIds = await Promise.all(
        newTagNames.map((name) =>
            prismaInstance.tag.upsert({
                where: {
                    name_userId: {
                        name,
                        userId,
                    },
                },
                update: {},
                create: {
                    name,
                    userId,
                },
                select: { id: true },
            })
        )
    );

    // Get tags from the database whose ids are in existingTags and whose userId matches
    // the current user. This means that even if the frontend somehow sends a tag that
    // belongs to a different user, it doesn't get associated with this bookmark.
    const validExistingTags = await prismaInstance.tag.findMany({
        where: {
            userId,
            id: {
                in: existingTagIds,
            },
        },
        select: { id: true },
    });
    // Merge and return
    const allTags = [...validExistingTags, ...createdTagIds];
    const dedupedTags = Array.from(
        new Map(allTags.map((tag) => [tag.id, tag])).values()
    );
    return dedupedTags;
}

const routes: FastifyPluginAsync = async (fastify: FastifyZod, options) => {
    const { prisma } = fastify;

    // Get all bookmarks for user
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: z.array(BookmarkSchema),
                    401: ErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const bookmarks = await prisma.bookmark.findMany({
                where: { userId },
                include: {
                    tags: true,
                },
            });
            reply.send(bookmarks);
        }
    );

    // Get users bookmark by id
    fastify.get(
        "/:id",
        {
            schema: {
                params: IntIdParams,
                response: {
                    200: BookmarkSchema,
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
            const bookmark = await prisma.bookmark.findUnique({
                where: { id },
                include: {
                    tags: true,
                },
            });
            if (!bookmark) {
                return reply
                    .status(404)
                    .send({ error: "Bookmark does not exist" });
            }
            if (bookmark.userId !== userId) {
                return reply.status(403).send({
                    error: "You are not authorised to access this bookmark",
                });
            }
            reply.send(bookmark);
        }
    );

    // Create a new bookmark
    fastify.post(
        "/",
        {
            schema: {
                body: BookmarkBodySchema,
                response: {
                    200: BookmarkWithCollectionsSchema,
                    401: ErrorResponseSchema,
                    500: ErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { title, url, description } = request.body;
            let tags = request.body.tags || [];
            let collections = request.body.collections || [];

            try {
                const createdBookmark = await prisma.$transaction(
                    async (tx) => {
                        const allTags = await createAndFormatTags(
                            tags,
                            userId,
                            tx
                        );
                        const bookmark = await tx.bookmark.create({
                            data: {
                                title,
                                url,
                                userId,
                                description,
                                tags: {
                                    connect: allTags,
                                },
                            },
                            include: {
                                tags: true,
                                collections: {
                                    include: { collection: true },
                                },
                            },
                        });
                        const formattedBookmark = {
                            ...bookmark,
                            collections: bookmark.collections.map(
                                (c) => c.collection
                            ),
                        };
                        return formattedBookmark;
                    }
                );
                reply.send(createdBookmark);
            } catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );

    // Update a bookmark
    fastify.patch(
        "/:id",
        {
            schema: {
                params: IntIdParams,
                body: BookmarkBodySchema,
                response: {
                    200: BookmarkSchema,
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
            const { title, url, description } = request.body;
            let tags = request.body.tags || [];
            let collections = request.body.collections || [];

            const bookmark = await prisma.bookmark.findUnique({
                where: { id },
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

            // Handle tags
            const allTags = await createAndFormatTags(tags, userId, prisma);
            try {
                const updatedBookmark = await prisma.$transaction(
                    async (tx) => {
                        const bookmark = await tx.bookmark.update({
                            where: { id, userId },
                            data: {
                                title,
                                url,
                                description,
                                tags: {
                                    set: allTags,
                                },
                            },
                            include: {
                                tags: true,
                            },
                        });
                        return bookmark;
                    }
                );
                reply.send(updatedBookmark);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Record not found
                    return reply
                        .status(404)
                        .send({ error: "Bookmark not found" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );

    // Delete a bookmark
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
            const bookmark = await prisma.bookmark.findUnique({
                where: { id },
                select: { userId: true },
            });
            if (!bookmark) {
                return reply
                    .status(404)
                    .send({ error: "Bookmark does not exist" });
            }
            if (bookmark.userId !== userId) {
                return reply.status(403).send({
                    error: "You are not authorised to access this bookmark",
                });
            }
            try {
                await prisma.$transaction(async (tx) => {
                    const collectionInclusions =
                        await tx.bookmarksInCollections.findMany({
                            where: {
                                bookmarkId: id,
                            },
                        });
                    await Promise.all(
                        collectionInclusions.map((ci) =>
                            tx.bookmarksInCollections.updateMany({
                                where: {
                                    collectionId: ci.collectionId,
                                    bookmarkIndex: { gt: ci.bookmarkIndex },
                                },
                                data: {
                                    bookmarkIndex: { decrement: 1 },
                                },
                            })
                        )
                    );
                    await tx.bookmark.delete({
                        where: { id },
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
};

export default routes;
