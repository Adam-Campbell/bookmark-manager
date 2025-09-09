import { QueryClient, queryOptions } from "@tanstack/react-query";
import {
    type Bookmark,
    type CollectionRepresentation,
    type CollectionWithBookmarkCount,
    type CollectionWithBookmarks,
    type Tag,
    type TagRepresentation,
} from "./types";

export const queryClient = new QueryClient();

export async function getTags(
    shouldShowSnackbar: boolean,
    signal?: AbortSignal
): Promise<Tag[]> {
    const response = await fetch("/api/tags", {
        credentials: "include",
        signal,
    });
    if (!response.ok) {
        const { status } = response;
        if (shouldShowSnackbar) {
            console.log("Here is where we would imperatively trigger snackbar");
        }
        throw new Response(undefined, {
            status,
        });
    }
    const tags: Tag[] = await response.json();
    return tags;
}

type TagsQueryOptions<T = Tag[]> = {
    shouldShowSnackbar?: boolean;
    select?: (data: Tag[]) => T;
};

export function tagsQuery<T = Tag[]>({
    shouldShowSnackbar = false,
    select,
}: TagsQueryOptions<T> = {}) {
    return queryOptions({
        queryKey: ["tags"],
        queryFn: async ({ signal }) => getTags(shouldShowSnackbar, signal),
        staleTime: 5 * 60 * 1000,
        placeholderData: [],
        ...(select && { select }),
    });
}

export function transformTagsToTagRepresentations(
    tags: Tag[]
): TagRepresentation[] {
    return tags.map((tag) => ({ id: tag.id, name: tag.name }));
}

export async function getCollections(
    shouldShowSnackbar: boolean,
    signal?: AbortSignal
): Promise<CollectionWithBookmarkCount[]> {
    const response = await fetch("/api/collections", {
        credentials: "include",
        signal,
    });
    if (!response.ok) {
        const { status } = response;
        if (shouldShowSnackbar) {
            console.log("Here is where we would imperatively trigger snackbar");
        }
        throw new Response(undefined, {
            status,
        });
    }
    const collections: CollectionWithBookmarkCount[] = await response.json();
    return collections;
}

type CollectionsQueryOptions<T = CollectionWithBookmarkCount[]> = {
    shouldShowSnackbar?: boolean;
    select?: (data: CollectionWithBookmarkCount[]) => T;
};

export function collectionsQuery<T = CollectionWithBookmarkCount[]>({
    shouldShowSnackbar = false,
    select,
}: CollectionsQueryOptions<T> = {}) {
    return queryOptions({
        queryKey: ["collections"],
        queryFn: async ({ signal }) =>
            getCollections(shouldShowSnackbar, signal),
        staleTime: 5 * 60 * 1000,
        placeholderData: [],
        ...(select && { select }),
    });
}

export function transformCollectionsToCollectionRepresentations(
    collections: CollectionWithBookmarkCount[]
): CollectionRepresentation[] {
    return collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
    }));
}

export async function getCollection(
    id: number,
    shouldShowSnackbar: boolean,
    signal?: AbortSignal
): Promise<CollectionWithBookmarks> {
    const response = await fetch(`/api/collections/${id}`, {
        credentials: "include",
        signal,
    });
    if (!response.ok) {
        const { status } = response;
        if (shouldShowSnackbar) {
            console.log("Here is where we would imperatively trigger snackbar");
        }
        throw new Response(undefined, { status });
    }
    const collection: CollectionWithBookmarks = await response.json();
    return collection;
}

type CollectionQueryOptions<T = CollectionWithBookmarks> = {
    id: number;
    shouldShowSnackbar?: boolean;
    select?: (data: CollectionWithBookmarks) => T;
};

export function collectionQuery({
    id,
    shouldShowSnackbar = false,
    select,
}: CollectionQueryOptions) {
    return queryOptions({
        queryKey: ["collections", { id }],
        queryFn: async ({ signal }) =>
            getCollection(id, shouldShowSnackbar, signal),
        staleTime: 5 * 60 * 1000,
        ...(select && { select }),
    });
}

export async function getBookmarks(
    shouldShowSnackbar: boolean,
    signal?: AbortSignal
): Promise<Bookmark[]> {
    const response = await fetch("/api/bookmarks", {
        credentials: "include",
        signal,
    });
    if (!response.ok) {
        const { status } = response;
        if (shouldShowSnackbar) {
            console.log("Here is where we would imperatively trigger snackbar");
        }
        throw new Response(undefined, {
            status,
        });
    }
    const bookmarks: Bookmark[] = await response.json();
    return bookmarks;
}

type BookmarksQueryOptions<T = Bookmark[]> = {
    shouldShowSnackbar?: boolean;
    select?: (data: Bookmark[]) => T;
};

export function bookmarksQuery({
    shouldShowSnackbar = false,
    select,
}: BookmarksQueryOptions = {}) {
    return queryOptions({
        queryKey: ["bookmarks"],
        queryFn: async ({ signal }) => getBookmarks(shouldShowSnackbar, signal),
        staleTime: 5 * 60 * 1000,
        placeholderData: [],
        ...(select && { select }),
    });
}
