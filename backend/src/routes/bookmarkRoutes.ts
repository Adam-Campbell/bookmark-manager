import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { Prisma, Tag, PrismaClient } from "../../generated/prisma/index.js";

type TagData = {
    id: number | null;
    name: string;
};

type CollectionData = {
    id: number;
};

type BookmarkResourceBody = {
    title: string;
    url: string;
    description?: string;
    tags?: TagData[];
    collections?: CollectionData[];
};

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
    prismaInstance: PrismaClient
): Promise<{ id: number }[]> {
    // Sort tags into existing (has an id) and new (id is null)
    const existingTags: { id: number }[] = tagsData
        .filter((tag) => tag.id !== null)
        .map((tag) => ({ id: tag.id as number }));
    const newTags = tagsData
        .filter((tag) => tag.id === null)
        .map((tag) => ({
            name: tag.name,
        }));

    // Create new tags in the database
    const createdTags: Tag[] = await Promise.all(
        newTags.map((tag) =>
            prismaInstance.tag.upsert({
                where: {
                    name_userId: {
                        name: tag.name,
                        userId,
                    },
                },
                update: {},
                create: {
                    name: tag.name,
                    userId,
                },
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
                in: existingTags.map((tag) => tag.id),
            },
        },
        select: { id: true },
    });
    // Merge and return
    const allTags = [
        ...validExistingTags,
        ...createdTags.map((tag) => ({ id: tag.id })),
    ];
    return allTags;
}

const routes: FastifyPluginAsync = async (fastify, options) => {
    const { prisma } = fastify;

    // Get all bookmarks for user
    fastify.get("/", async (request: FastifyRequest, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                tags: true,
                collections: true,
            },
        });
        reply.send(bookmarks);
    });

    // Get users bookmark by id
    fastify.get(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            const bookmark = await prisma.bookmark.findUnique({
                where: { id, userId },
                include: {
                    tags: true,
                    collections: true,
                },
            });
            if (!bookmark) {
                return reply.status(404).send({ error: "Bookmark not found" });
            }
            reply.send(bookmark);
        }
    );

    // Create a new bookmark
    fastify.post(
        "/",
        async (
            request: FastifyRequest<{ Body: BookmarkResourceBody }>,
            reply
        ) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const { title, url, description } = request.body;
            let tags = request.body.tags || [];
            let collections = request.body.collections || [];

            const allTags = await createAndFormatTags(tags, userId, prisma);
            const bookmark = await prisma.bookmark.create({
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
                    collections: true,
                },
            });
            reply.send(bookmark);
        }
    );

    // Update a bookmark
    fastify.patch(
        "/:id",
        async (
            request: FastifyRequest<{
                Params: { id: string };
                Body: BookmarkResourceBody;
            }>,
            reply
        ) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            const { title, url, description } = request.body;
            let tags = request.body.tags || [];
            let collections = request.body.collections || [];

            // Handle tags
            const allTags = await createAndFormatTags(tags, userId, prisma);
            try {
                const bookmark = await prisma.bookmark.update({
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
                        collections: true,
                    },
                });
                reply.send(bookmark);
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
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const id = Number(request.params.id);
            try {
                await prisma.bookmark.delete({
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
                        .send({ error: "Bookmark not found" });
                }
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    );
};

export default routes;
