import { z } from "zod";

export const BookmarkBodySchema = z.object({
    title: z.string(),
    url: z.url(),
    description: z.string().optional(),
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

// z.iso.datetime()

export const TagSchema = z.object({
    id: z.number(),
    name: z.string().min(2).max(100),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const BookmarkSchema = z.object({
    id: z.number(),
    title: z.string(),
    url: z.url(),
    description: z.string().optional(),
    tags: z.array(TagSchema),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CollectionSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CollectionWithBookmarkCountSchema = CollectionSchema.extend({
    bookmarkCount: z.number(),
});

export const BookmarkWithCollectionsSchema = BookmarkSchema.extend({
    collections: z.array(CollectionSchema),
});

export const BookmarkWithIndexSchema = BookmarkSchema.extend({
    bookmarkIndex: z.number(),
});

export const CollectionWithBookmarksSchema = CollectionSchema.extend({
    bookmarks: z.array(BookmarkWithIndexSchema),
});

export const ErrorResponseSchema = z.object({
    error: z.string(),
});
