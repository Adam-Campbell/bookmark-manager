export type Tag = {
    id: number;
    name: string;
    userId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};

export type Bookmark = {
    id: number;
    title: string;
    url: string;
    description: string;
    tags: Tag[];
    userId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};

export type Collection = {
    id: number;
    title: string;
    description: string;
    userId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};

export type CollectionWithBookmarkCount = Collection & {
    bookmarkCount: number;
};

export type BookmarkWithCollections = Bookmark & {
    collections: Collection[];
};

export type CollectionWithBookmarks = Collection & {
    bookmarks: Array<Bookmark & { bookmarkIndex: number }>;
};

export type TagRepresentation = {
    id: number | null;
    name: string;
};

export type CollectionRepresentation = {
    id: number;
    title: string;
};
