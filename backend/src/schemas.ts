import { z } from "zod";

export const IntId = z.coerce.number().int().nonnegative();

export const IntIdParams = z.object({
    id: IntId,
});

export const CollectionBodySchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().min(1).max(500),
});

export const BookmarkBodySchema = z.object({
    title: z.string().min(1).max(150),
    url: z.url(),
    description: z.string().min(1).max(500),
    tags: z
        .array(
            z.object({
                id: z.number().nullable(),
                name: z.string(),
            })
        )
        .optional(),
    collections: z
        .array(
            z.object({
                id: z.number(),
                title: z.string(),
            })
        )
        .optional(),
});

export const TagSchema = z.object({
    id: z.int().nonnegative(),
    name: z.string().min(1).max(60),
    userId: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const BookmarkSchema = z.object({
    id: z.int().nonnegative(),
    title: z.string().min(1).max(150),
    url: z.url(),
    description: z.string().min(1).max(500),
    tags: z.array(TagSchema),
    userId: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CollectionSchema = z.object({
    id: z.int().nonnegative(),
    title: z.string().min(1).max(150),
    description: z.string().min(1).max(500),
    userId: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CollectionWithBookmarkCountSchema = CollectionSchema.extend({
    bookmarkCount: z.int().nonnegative(),
});

export const BookmarkWithCollectionsSchema = BookmarkSchema.extend({
    collections: z.array(CollectionSchema),
});

export const BookmarkWithIndexSchema = BookmarkSchema.extend({
    bookmarkIndex: z.int().nonnegative(),
});

export const CollectionWithBookmarksSchema = CollectionSchema.extend({
    bookmarks: z.array(BookmarkWithIndexSchema),
});

export const ErrorResponseSchema = z.object({
    error: z.string(),
});
