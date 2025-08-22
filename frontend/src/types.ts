export type Tag = {
    id: number;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export type BookmarkCollectionRelation = {
    id: number;
    bookmarkId: number;
    collectionId: number;
    bookmarkIndex: number;
    createdAt: string;
    updatedAt: string;
};

export type Bookmark = {
    id: number;
    title: string;
    description: string | undefined;
    url: string;
    tags: Tag[];
    collections: BookmarkCollectionRelation[];
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export type Collection = {
    id: number;
    title: string;
    description?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};
