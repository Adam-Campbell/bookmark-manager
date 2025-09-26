import { Grid } from "@mui/material";
import { useModal } from "../../ModalContext";
import { type CollectionWithBookmarkCount } from "../../types";
import EmptyListDisplay from "../EmptyListDisplay";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { CollectionCard } from "./CollectionCard";

export default function CollectionsGrid({
    collections,
}: {
    collections: CollectionWithBookmarkCount[];
}) {
    const { openModal } = useModal();

    if (collections.length === 0) {
        return (
            <EmptyListDisplay
                message="It looks like you haven't created any collections yet."
                extraInfo="Collections allow you to organise your bookmarks into distinct lists. Create one to get started!"
                creationMessage="Create Collection"
                creationAction={() => openModal("addCollection")}
            />
        );
    }

    return (
        <Grid container spacing={2}>
            {collections.map((collection) => (
                <Grid
                    display="flex"
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    key={collection.id}
                >
                    <CollectionCard collection={collection} />
                </Grid>
            ))}
            <Grid display="flex" size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CreateCollectionCard />
            </Grid>
        </Grid>
    );
}
