export type Tag = {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TagRepresentation = {
    id: number | null;
    name: string;
};

export type TagsAutocompleteProps = {
    chosenTags: TagRepresentation[];
    handleTagsChange: React.Dispatch<React.SetStateAction<TagRepresentation[]>>;
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
    id: number | null;
    title: string;
};

export type CollectionsAutocompleteProps = {
    chosenCollections: CollectionRepresentation[];
    handleCollectionsChange: React.Dispatch<
        React.SetStateAction<CollectionRepresentation[]>
    >;
};
