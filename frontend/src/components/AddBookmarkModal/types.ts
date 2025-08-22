export type Tag = {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

type TagRepresentation = {
    id: number | null;
    name: string;
};

export type Collection = {
    id: number;
    title: string;
    description?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CollectionRepresentation = {
    id: number;
    title: string;
};

export type CollectionsAutocompleteProps = {
    chosenCollections: CollectionRepresentation[];
    handleCollectionsChange: React.Dispatch<
        React.SetStateAction<CollectionRepresentation[]>
    >;
};

export type BookmarkResourceBody = {
    title: string;
    url: string;
    description?: string;
    tags?: TagRepresentation[];
    collections?: CollectionRepresentation[];
};
